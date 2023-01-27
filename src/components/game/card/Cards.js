import Card from "./Card";
import "./Cards.css";

const Cards = ({ cards = [], onCardClick, draggable, vertical, disable }) => {
  return (
    <div className="cards">
      {cards.map((card, index) => {
        console.log("refreshCards", cards);
        return (
          <div
            className={`cards-card ${disable ? " disable" : ""}`}
            key={index}
          >
            <Card
              id={disable ? "" : card.id}
              value={card.value}
              color={card.color}
              disable={disable}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Cards;
