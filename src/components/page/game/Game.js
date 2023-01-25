import { useEffect, useRef } from "react";
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

    fetch(APIRoutes.playGame, {
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
          socket.current = io(APIRoutes.host);
          socket.current.on("updateGame", (data) => {
            console.log("updateGame", data);
          });
          socket.current.emit("playGame", {
            id: location.state.id,
            token: localStorage.getItem("user"),
          });
        } else {
          toast.error(data.message);
        }
      });
    });
  });

  const cards = [
    {
      id: "cardId1",
      color: "rouge",
      value: 8,
    },
    {
      id: "cardId2",
      color: "jaune",
      value: 9,
    },
    {
      id: "cardId3",
      color: "vert",
      value: 2,
    },
    {
      id: "cardId4",
      color: "rouge",
      value: 1,
    },
    {
      id: "cardId5",
      color: "bleu",
      value: 4,
    },
    {
      id: "cardId6",
      color: "rouge",
    },
    {
      id: "cardId7",
      color: "rouge",
      value: 7,
    },
  ];

  return (
    <div className={"game"}>
      <Grid size={6}></Grid>

      <Cards cards={cards}></Cards>
    </div>
  );
};

export default Game;
