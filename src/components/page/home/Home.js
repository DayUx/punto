// importation des modules nécessaires pour la page Home
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameListItem from "../../base/gameListItem/GameListItem";
import "./Home.css";
import IconButton from "../../base/button/IconButton";
import { MdAdd } from "react-icons/md";
import SegmentedButton from "../../base/button/SegmentedButton";
import { APIRoutes } from "../../../utils/APIRoutes";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

// création du composant Home
const Home = () => {
  // utilisation de useNavigate pour naviguer entre les différentes pages
  const navigate = useNavigate();
  // state contenant la liste des parties en attente de joueurs
  const [games, setGames] = useState([]);
  // state pour la mise à jour d'une partie
  const [arrivalUpdate, setArrivalUpdate] = useState();
  // state pour la suppression d'une partie
  const [removedGame, setRemovedGame] = useState();
  // state contenu le meilleur et le pire joueur
  const [bestAndWorst, setBestAndWorst] = useState({
    playerWithMostWins: null,
    playerWithMostLosses: null,
  });

  // utilisation de useEffect pour mettre à jour la partie en cours
  useEffect(() => {
    arrivalUpdate && updateGame(arrivalUpdate);
  }, [arrivalUpdate]);

  // utilisation de useEffect pour supprimer une partie en cours
  useEffect(() => {
    removedGame && removeGame(arrivalUpdate);
  }, [removedGame]);

  // utilisation de useRef pour initialiser l'objet socket
  const socket = useRef();

  // fonction pour décoder le token JWT
  const wt_decode = (token) => {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  // state contenant les informations nécessaires pour créer une nouvelle partie
  const [fields, setFields] = useState({
    name: "",
    maxPlayers: 2,
  });

  // utilisation de useEffect pour récupérer la liste des parties en cours
  useEffect(() => {
    fetch(APIRoutes.getBestAndWorst, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("user"),
      },
    }).then((response) => {
      const ok = response.ok;
      response.json().then((data) => {
        if (ok) {
          setBestAndWorst(data);
        }
      });
    });

    // affichage d'un toast de chargement
    toast.dismiss();
    if (!localStorage.getItem("user")) {
      socket.current?.removeAllListeners();
      navigate("/login");
    }
    // récupération de la liste des parties en cours
    getGames();
  }, []);

  // fonction pour récupérer la liste des parties en cours
  const getGames = () => {
    fetch(APIRoutes.getGames, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("user"),
      },
    }).then((response) => {
      const ok = response.ok;
      response.json().then((data) => {
        if (ok) {
          // mise à jour de la liste des parties en cours
          setGames(data.games);
          // initialisation de l'objet socket
          socket.current = io(APIRoutes.host);
          // écoute de l'événement "updateGameList" pour mettre à jour une partie en cours
          socket.current.on("updateGameList", (data) => {
            setArrivalUpdate(data);
          });
          // écoute de l'événement "removeGame" pour supprimer une partie en cours
          socket.current.on("removeGame", (data) => {
            setRemovedGame(data);
          });
          // envoi d'un message "gamelist" avec le token JWT pour se connecter au serveur de WebSocket
          socket.current.emit("gamelist", {
            token: localStorage.getItem("user"),
          });
        } else {
          toast.error(data.message);
          if (response.status === 401) {
            localStorage.removeItem("user");
            socket.current?.removeAllListeners();
            navigate("/login");
          }
        }
      });
    });
  };

  // fonction pour mettre à jour une partie en attente de joueurs
  const updateGame = (game) => {
    const index = games.findIndex((g) => g._id === game._id);
    if (index !== -1) {
      const newGames = [...games];
      newGames[index] = game;
      setGames(newGames);
    } else {
      setGames((oldGames) => [...oldGames, game]);
    }
  };
  // fonction pour supprimer une partie en attente de joueurs

  const removeGame = (game) => {
    const index = games.findIndex((g) => g._id === game._id);
    if (index !== -1) {
      const newGames = [...games];
      newGames.splice(index, 1);
      setGames(newGames);
    }
  };
  // fonction pour créer une nouvelle partie

  const createNewGame = () => {
    fetch(APIRoutes.newGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("user"),
      },
      body: JSON.stringify({
        name: fields.name,
        maxPlayers: fields.maxPlayers,
      }),
    }).then((response) => {
      const ok = response.ok;
      response.json().then((data) => {
        if (ok) {
          socket.current.emit("leave");
          socket.current.removeAllListeners();
          navigate("/wait", { state: { id: data.game._id } });
        } else {
          alert(data.message);
        }
      });
    });
  };

  return (
    <div className={"home"}>
      <div className={"home-content"}>
        <div className={"gameList glowingBorder"}>
          <div className={"content"}>
            {games.length > 0 ? (
              games.map((game, index) => {
                return (
                  <GameListItem
                    key={index}
                    opaque={index % 2 === 0}
                    numberPlayers={game.numPlayers}
                    maxPlayers={game.maxPlayers}
                    name={game.name}
                    id={game._id}
                  ></GameListItem>
                );
              })
            ) : (
              <div className={"noGames"}>
                <h1>Aucune partie trouvée</h1>
              </div>
            )}
          </div>
        </div>
        <div className={"createGame glowingBorder"}>
          <input
            className={"gameName"}
            placeholder={"Name of the game"}
            required
            value={fields.name}
            onChange={(e) => {
              setFields({ ...fields, name: e.target.value });
            }}
          />
          <SegmentedButton
            options={[
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
            ]}
            value={fields.maxPlayers}
            onChange={(value) => {
              setFields({ ...fields, maxPlayers: value });
            }}
          ></SegmentedButton>
          <IconButton color={"#0f0"} onClick={createNewGame}>
            <MdAdd size={25} />
          </IconButton>
        </div>
        <div className={"stats"}>
          <div className={"stat"}>
            <h2>Meilleur joueur</h2>
            <h3>{bestAndWorst.playerWithMostWins?.username}</h3>
          </div>
          <div className={"stat"}>
            <h2>Pire joueur</h2>
            <h3>{bestAndWorst.playerWithMostLosses?.username}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
