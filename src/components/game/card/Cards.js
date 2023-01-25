import Card from "./Card";
import "./Cards.css";

const Cards = ({ cards, onCardClick, draggable, vertical, disable }) => {
  return (
    <div
      className="cards"
      style={{
        flexDirection: vertical ? "column" : "row",
      }}
    >
      {cards.map((card, index) => (
        <div
          className={`cards-card ${disable ? " disable" : ""}`}
          style={
            vertical
              ? { height: `calc(100% - 120px / ${cards.length - 1})` }
              : {
                  width: `calc(100% - 120px / ${cards.length - 1})`,
                }
          }
          key={index}
        >
          <Card
            id={disable ? "" : card.id}
            value={card.value}
            color={card.color}
            disable={disable}
          />
        </div>
      ))}
    </div>
  );
};
export default Cards;
