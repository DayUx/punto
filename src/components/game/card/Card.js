import "./Card.css";
import { createRef, forwardRef, useImperativeHandle } from "react";
import Logo from "../../base/logo/Logo";

const Card = forwardRef(
  ({ color, value, id, disable, size = 50, blinking = false }, ref) => {
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

    const isColorValid = (color) => {
      return (
        color === "rouge" ||
        color === "bleu" ||
        color === "vert" ||
        color === "jaune"
      );
    };

    return (
      <div
        ref={cardRef}
        style={{
          width: size,
          height: size,
        }}
        className={`card ${color} value-${value} ${
          !value || value < 0 || value > 9 ? "turned" : ""
        } ${disable ? "disable" : ""} ${blinking ? "blinking" : ""}`}
        id={id}
        value={value}
        color={color}
        onDragStart={function (e) {
          if (
            !disable &&
            cardRef.current.draggable &&
            value &&
            isColorValid(color)
          ) {
            e.dataTransfer.setData("id", id);
          } else {
            e.preventDefault();
          }
        }}
        draggable
      >
        <div className={"content"}>
          <div className={"front"}>
            {value && isColorValid(color) ? (
              diceFace[value].map((row, rowIndex) => {
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
              })
            ) : (
              <></>
            )}
          </div>
          <div className={"back"}>
            <Logo size={20} />
          </div>
        </div>
      </div>
    );
  }
);
export default Card;
