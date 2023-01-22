import { createRef, forwardRef, useImperativeHandle, useState } from "react";
import Card from "../../game/card/Card";
import "./Loader.css";

const Loader = forwardRef(({ id = "loader" }, ref) => {
  const cardRef = createRef();

  const [turn, setTurn] = useState(false);
  const [color, setColor] = useState("rouge");
  let [value, setValue] = useState(1);

  useImperativeHandle(ref, () => ({
    load: () => {
      setTurn(true);
      loopTurn();
    },
    unload: () => {
      setTurn(false);
    },
  }));

  const pickRandomColor = () => {
    const colors = ["rouge", "bleu", "vert", "jaune"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  };

  const loopTurn = () => {
    setTimeout(() => {
      turnCard();
      setTimeout(() => {
        pickRandomColor();

        value = value === 9 ? 1 : value + 1;
        setValue(value);

        turnCard();
        loopTurn();
      }, 1000);
    }, 1500);
  };
  const turnCard = () => {
    document.getElementById(id + "Card").classList.toggle("turned");
  };

  return (
    <div className={`loader ${turn ? "loading" : ""}`}>
      <Card ref={cardRef} color={color} id={id + "Card"} value={value} />
    </div>
  );
});

export default Loader;
