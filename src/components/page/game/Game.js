import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APIRoutes } from "../../../utils/APIRoutes";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Grid from "../../game/grid/Grid";
import Card from "../../game/card/Card";
import Cards from "../../game/card/Cards";

import "./Game.css";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef();

  const [card, setCard] = useState([]);
  const [grid, setGrid] = useState([]);

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
      setCard(data.card);
      setGrid(data.grid.grid);
    });

    socket.current.emit("playGame", {
      id: location.state.id,
      token: localStorage.getItem("user"),
    });

    // fetch(APIRoutes.playGame, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-access-token": localStorage.getItem("user"),
    //   },
    //   body: JSON.stringify({
    //     id: location.state.id,
    //   }),
    // }).then((response) => {
    //   const ok = response.ok;
    //   response.json().then((data) => {
    //     if (ok) {
    //
    //     } else {
    //       toast.error(data.message);
    //     }
    //   });
    // });
  }, []);

  return (
    <div className={"game"}>
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

      <Card value={card.value} id={card.id} color={card.color}></Card>
    </div>
  );
};

export default Game;
