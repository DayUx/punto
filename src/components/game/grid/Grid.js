import "./Grid.css";
import { useState } from "react";
import Card from "../card/Card";

const Grid = ({ onCardDrop = function () {}, grid = [], endOfGame }) => {
  const [zoom, setZoom] = useState(1);

  function onDrop(column, rowIndex, columnIndex) {
    return function (e) {
      e.target.classList.remove("hovered");
      if (column.placable) {
        onCardDrop(e.dataTransfer.getData("id"), rowIndex, columnIndex);
      }
    };
  }
  return (
    <div
      onWheel={function (e) {
        e.stopPropagation();
        setZoom((zoom) => {
          if (zoom > 0.5 && zoom < 2.5) {
            if (e.deltaY < 0) {
              return zoom + 0.2;
            } else {
              return zoom - 0.2;
            }
          }
          if (zoom <= 0.5 && e.deltaY < 0) {
            return zoom + 0.2;
          }
          if (zoom >= 2.5 && e.deltaY > 0) {
            return zoom - 0.2;
          }
          return zoom;
        });
      }}
      className={`grid`}
      style={
        grid
          ? {
              gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
              transform: `translate(-50%, -50%) scale(${zoom})  `,
              transition: "transform 0.5s",
            }
          : {
              transform: `translate(-50%, -50%) scale(${zoom})`,
              transition: "transform 0.5s",
            }
      }
    >
      {grid ? (
        grid.map((row, rowIndex) => {
          return (
            <>
              {row.map((column, columnIndex) => {
                return (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    style={{
                      width: `calc(var(--grid-width) / ${grid.length})`,
                      height: `calc(var(--grid-width) / ${grid.length})`,
                    }}
                    className={`cell row-${rowIndex} column-${columnIndex} ${
                      column.placable && !endOfGame ? "placable" : ""
                    }`}
                    onDragOver={function (e) {
                      e.target.classList.add("hovered");
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onDragLeave={function (e) {
                      e.target.classList.remove("hovered");
                    }}
                    onDragStart={function (e) {
                      e.preventDefault();
                    }}
                    onDrop={onDrop(column, rowIndex, columnIndex)}
                  >
                    {column.empty ? (
                      <></>
                    ) : (
                      <Card
                        color={column.card.color}
                        value={column.card.value}
                        disable={true}
                      />
                    )}
                  </div>
                );
              })}
            </>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
export default Grid;
