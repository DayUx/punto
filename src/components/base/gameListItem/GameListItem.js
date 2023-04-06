import IconButton from "../button/IconButton";
import { MdPlayArrow, MdOutlineClose } from "react-icons/md";
import "./GameListItem.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const GameListItem = ({
  name,
  maxPlayers,
  numberPlayers = 0,
  id,
  opaque = false,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`gameListItem ${opaque ? "opaque" : ""}`}>
      <span className={"title"}>{name}</span>
      <span className={"infos"}>
        <span className={"numberPlayers glowingBorder"}>
          {numberPlayers}/{maxPlayers}
        </span>

        <IconButton
          color={"#0f0"}
          onClick={() => {
            navigate("/wait", {
              state: {
                name: name,
                maxPlayers: maxPlayers,
                numberPlayers: numberPlayers,
                id: id,
              },
            });
          }}
        >
          <MdPlayArrow size={25}></MdPlayArrow>
        </IconButton>
      </span>
    </div>
  );
};

export default GameListItem;
