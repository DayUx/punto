import "./Grid.css";
import { useEffect, useState } from "react";
import Card from "../card/Card";

const Grid = ({ onCardDrop = function () {}, grid = [] }) => {
  console.log(grid);

  function onDrop(column, rowIndex, columnIndex) {
    return function (e) {
      e.target.classList.remove("hovered");
      if (column.placable && !e.target.classList.contains("filled")) {
        const card = document.getElementById(e.dataTransfer.getData("id"));
        onCardDrop(e.dataTransfer.getData("id"), rowIndex, columnIndex);
      }
    };
  }

  useEffect(() => {
    console.log(grid);
  }, [grid]);

  return (
    <div
      className={`grid`}
      style={
        grid
          ? {
              gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
            }
          : {}
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
                      column.placable ? "placable" : ""
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
