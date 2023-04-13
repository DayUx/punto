import "./Player.css";
import Card from "../../game/card/Card";
const Player = ({
  colors = [],
  card,
  isPlaying = false,
  username,
  player,
  playerPlaying,
  size = "small",
  draggable = true,
  vertical = false,
  endOfGame,
}) => {
  return (
    <div
      style={
        vertical
          ? {
              flexDirection: "column",

              gap: size === "small" ? 10 : 20,
            }
          : {
              flexDirection: "row",
            }
      }
      className={"player"}
    >
      <div
        style={
          vertical
            ? {
                flexDirection: "row-reverse",
                gap: size === "small" ? 10 : 20,
                alignItems: "center",
                justifyContent: "center",
              }
            : {
                flexDirection: "column",
              }
        }
        className={"infos"}
      >
        <div
          className={"username"}
          style={{
            fontSize: size === "small" ? "1.5rem" : "3.5rem",
          }}
        >
          {username}
        </div>
        <div className={"dots"}>
          {colors.map((color, index) => {
            return (
              <div
                style={{
                  width: size === "small" ? 10 : 20,
                  height: size === "small" ? 10 : 20,
                }}
                className={`${color} dot`}
              ></div>
            );
          })}
        </div>
      </div>
      {!endOfGame ? (
        <Card
          disable={!playerPlaying || !draggable}
          value={card?.value}
          id={card?.id}
          color={card?.color}
          size={size === "small" ? 50 : 90}
          blinking={playerPlaying?.id === player?.id}
        ></Card>
      ) : undefined}
    </div>
  );
};

export default Player;
