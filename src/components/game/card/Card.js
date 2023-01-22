import "./Card.css";
import { createRef, forwardRef, useImperativeHandle } from "react";
import Logo from "../../base/logo/Logo";

const Card = forwardRef(({ color, value, id }, ref) => {
  const cardRef = createRef();

  useImperativeHandle(ref, () => ({
    turnCard: () => {
      cardRef.current.classList.toggle("turned");
    },
  }));

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

  const turnCard = () => {
    cardRef.current.classList.toggle("turned");
  };

  const onDragEnter = (e, position) => {
    console.log(e.target.innerhtml);
  };

  return (
    <div
      ref={cardRef}
      className={`card ${color} value-${value}`}
      id={id}
      value={value}
      color={color}
      onDragStart={function (e) {
        if (cardRef.current.draggable) {
          e.dataTransfer.setData("id", id);
        } else {
          e.preventDefault();
        }
      }}
      draggable
    >
      <div className={"content"}>
        <div className={"front"}>
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
        <div className={"back"}>
          <Logo size={30} />
        </div>
      </div>
    </div>
  );
});
export default Card;
