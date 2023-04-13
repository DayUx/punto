import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Wait.css";
import { useEffect, useRef, useState } from "react";
import { APIRoutes } from "../../../utils/APIRoutes";
import { io } from "socket.io-client";
import Loading from "../../game/loading/Loading";

const Wait = () => {
  //utilisation de la fonction location de react-router-dom pour récupérer les paramètres de l'url
  const location = useLocation();
  // Initialisation du socket
  const socket = useRef();
  //Text de chargement
  const [loadingText, setLoadingText] = useState(undefined);
  let loading;

  //infos du jeu
  const [game, setGame] = useState({
    name: "",
    numberPlayers: 0,
    maxPlayers: 0,
  });
  //utilisation de useNavigate pour naviguer entre les différentes pages
  const navigate = useNavigate();

  //utilisation de useEffect pour récupérer les informations de la partie
  useEffect(() => {
    loading = toast.loading("Waiting for other players...", {
      position: "bottom-center",
    });
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
    if (!location.state) {
      navigate("/home");
    }
    if (!location.state.id) {
      navigate("/home");
    }

    fetch(APIRoutes.joinGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("user"),
      },
      body: JSON.stringify({
        id: location.state.id,
      }),
    }).then((response) => {
      const ok = response.ok;
      response.json().then((data) => {
        if (ok) {
          setGame({
            name: data.game.name,
            numberPlayers: data.game.players.length,
            maxPlayers: data.game.maxPlayers,
          });
          setPlayers(data.game.players);

          socket.current = io(APIRoutes.host);

          socket.current.on("updateGame", (data) => {
            setGame({
              name: data.name,
              numberPlayers: data.players.length,
              maxPlayers: data.maxPlayers,
            });
            setPlayers(data.players);
          });
          socket.current.on("loading", (text) => {
            toast.dismiss();
            setLoadingText(text);
          });

          socket.current.on("startGame", (data) => {
            toast.dismiss();
            navigate("/game", {
              state: {
                id: data._id,
              },
            });
          });

          socket.current.emit("joingame", {
            gameId: data.game._id,
            token: localStorage.getItem("user"),
          });
        } else {
          toast.dismiss(loading);
          toast.error(data.message, {
            position: "bottom-center",
          });
          toast.error(data.message);
          if (response.status === 401) {
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          navigate("/home");
        }
      });
    });
  }, []);

  const [players, setPlayers] = useState([]);

  return (
    <div className="wait">
      <Loading text={loadingText}></Loading>
      <div className="waitContainer glowingBorder">
        <div className="gameInfos">
          <span className="title">{game.name}</span>
          <span className="numberPlayers glowingBorder">
            {game.numberPlayers}/{game.maxPlayers}
          </span>
        </div>
        <div className={"playerList"}>
          {players.map((player, index) => {
            return (
              <div
                key={index}
                className={`player ${index % 2 === 0 ? "opaque" : ""}`}
              >
                <span className={"name"}>{player.username}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Wait;
