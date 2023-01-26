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

const Home = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [arrivalUpdate, setArrivalUpdate] = useState();
  const [removedGame, setRemovedGame] = useState();

  useEffect(() => {
    arrivalUpdate && updateGame(arrivalUpdate);
  }, [arrivalUpdate]);
  useEffect(() => {
    removedGame && removeGame(arrivalUpdate);
  }, [removedGame]);

  const socket = useRef();

  const wt_decode = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  const [fields, setFields] = useState({
    name: "",
    maxPlayers: 2,
  });

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
    getGames();
  }, []);

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
          setGames(data.games);
          socket.current = io(APIRoutes.host);

          socket.current.on("updateGame", (data) => {
            console.log("updateGame", data);
            setArrivalUpdate(data);
          });
          socket.current.on("removeGame", (data) => {
            console.log("removeGame", data);
            setRemovedGame(data);
          });

          socket.current.emit("gamelist", {
            token: localStorage.getItem("user"),
          });
        } else {
          toast.error(data.message);
          if (response.status === 401) {
            localStorage.removeItem("user");
            navigate("/login");
          }
        }
      });
    });
  };

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

  const removeGame = (game) => {
    const index = games.findIndex((g) => g._id === game._id);
    console.log(index);
    console.log(games);
    if (index !== -1) {
      const newGames = [...games];
      newGames.splice(index, 1);
      console.log(newGames);
      setGames(newGames);
    }
  };

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
        <div className={"gameList"}>
          {games.length > 0 ? (
            games.map((game, index) => {
              return (
                <GameListItem
                  key={index}
                  numberPlayers={game.players.length}
                  maxPlayers={game.maxPlayers}
                  name={game.name}
                  id={game._id}
                ></GameListItem>
              );
            })
          ) : (
            <div className={"noGames"}>
              <h1>No games available</h1>
            </div>
          )}
        </div>
        <div className={"createGame"}>
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
      </div>
    </div>
  );
};

export default Home;
