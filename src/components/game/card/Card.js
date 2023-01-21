import "./Card.css";
import { createRef } from "react";

const Card = ({ color, value }) => {
  const ref = createRef();

  const diceFace = {
    1: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    2: [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ],
    3: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    4: [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ],
    5: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    6: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
    ],
    7: [
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
    ],
    8: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    9: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  };

  const onDragEnter = (e, position) => {
    console.log(e.target.innerhtml);
  };

  return (
    <div
      ref={ref}
      className={`card ${color} value-${value}`}
      id={`card${value}${color}`}
      value={value}
      color={color}
      onDragStart={function (e) {
        if (ref.current.draggable) {
          e.dataTransfer.setData("id", `card${value}${color}`);
        } else {
          e.preventDefault();
        }
      }}
      draggable
    >
      {diceFace[value].map((row, rowIndex) => {
        return (
          <>
            {row.map((cell, cellIndex) => {
              return (
                <div
                  className={`dot ${cell ? "filled" : ""}`}
                  key={cellIndex}
                ></div>
              );
            })}
          </>
        );
      })}
    </div>
  );
};
export default Card;
