import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APIRoutes } from "../../../utils/APIRoutes";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Grid from "../../game/grid/Grid";
import Card from "../../game/card/Card";
import Cards from "../../game/card/Cards";

import "./Game.css";
import Player from "../../base/player/Player";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef();

  const [card, setCard] = useState([]);
  const [grid, setGrid] = useState([]);
  const [playerPlaying, setPlayerPlaying] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
    if (!location.state) {
      navigate("/home");
    }
    if (!location.state.id) {
      navigate("/home");
    }

    socket.current = io(APIRoutes.host);
    socket.current.on("updateGame", (data) => {
      console.log("updateGame", data);
      setGrid(data.grid.grid);
      setPlayers(orderPlayers(data.players));
      setPlayerPlaying(data.playerPlaying);
    });

    socket.current.emit("playGame", {
      id: location.state.id,
      token: localStorage.getItem("user"),
    });
  }, []);
  const wt_decode = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };
  const orderPlayers = (players) => {
    const playersOrdered = [];
    const me = players.find(
      (p) => p.id === wt_decode(localStorage.getItem("user")).id
    );
    playersOrdered.push(me);
    players.forEach((p) => {
      if (p.id !== me.id) {
        playersOrdered.push(p);
      }
    });
    console.log("playersOrdered", playersOrdered);
    return playersOrdered;
  };

  return (
    <div className={"game"}>
      {playerPlaying.id === players[0]?.id ? (
        <span className={"gameInfo"}>C'est à vous de jouer</span>
      ) : (
        <span className={"gameInfo"}>
          C'est au tour de {playerPlaying.username}
        </span>
      )}

      <div className={"ennemies"}>
        {players.length === 2 ? (
          <Player
            card={players[1]?.currentCard}
            colors={players[1]?.colors}
            username={players[1]?.username}
            player={players[1] ? players[1] : {}}
            playerPlaying={playerPlaying}
            draggable={false}
          ></Player>
        ) : players.length === 4 ? (
          <Player
            card={players[2]?.currentCard}
            colors={players[2]?.colors}
            username={players[2]?.username}
            player={players[2] ? players[2] : {}}
            playerPlaying={playerPlaying}
            draggable={false}
          ></Player>
        ) : null}
        {players.length > 2 ? (
          <div className={"rowEnnemies"}>
            <Player
              card={players[1]?.currentCard}
              colors={players[1]?.colors}
              username={players[1]?.username}
              player={players[1] ? players[1] : {}}
              playerPlaying={playerPlaying}
              draggable={false}
              vertical={true}
            ></Player>
            <Player
              card={players[players.length - 1]?.currentCard}
              colors={players[players.length - 1]?.colors}
              username={players[players.length - 1]?.username}
              player={
                players[players.length - 1] ? players[players.length - 1] : {}
              }
              playerPlaying={playerPlaying}
              draggable={false}
              vertical={true}
            ></Player>
          </div>
        ) : null}
      </div>
      <Grid
        size={6}
        onCardDrop={(id, x, y) => {
          console.log(
            "placeCard : ",
            "cardId",
            id,
            "x",
            x,
            "y",
            y,
            "token",
            localStorage.getItem("user"),
            "gameId",
            location.state.id
          );
          socket.current.emit("placeCard", {
            cardId: id,
            x: x,
            y: y,
            token: localStorage.getItem("user"),
            gameId: location.state.id,
          });
        }}
        grid={grid}
      ></Grid>
      <Player
        card={players[0]?.currentCard}
        colors={players[0]?.colors}
        username={players[0]?.username}
        player={players[0] ? players[0] : {}}
        playerPlaying={playerPlaying}
        size={"large"}
        draggable={playerPlaying.id === players[0]?.id}
      ></Player>
    </div>
  );
};

export default Game;
