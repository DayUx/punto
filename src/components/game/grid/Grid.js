import "./Grid.css";
import { useEffect, useState } from "react";

const Grid = ({ size }) => {
  const [grid, setGrid] = useState(null);

  const emptyGrid = () => {
    let grid = [];
    for (let i = 0; i < size; i++) {
      grid.push([]);
      for (let j = 0; j < size; j++) {
        grid[i].push({ empty: true });
      }
    }
    setGrid(grid);
  };

  useEffect(() => {
    if (grid === null) {
      emptyGrid();
    }
  }, []);

  emptyGrid();

  return (
    <div className={`grid size-${size}`}>
      {Array.from(Array(size).keys()).map((row, rowIndex) => {
        return (
          <>
            {Array.from(Array(size).keys()).map((column, columnIndex) => {
              return (
                <div
                  className={`cell row-${rowIndex} column-${columnIndex}`}
                  onDragOver={function (e) {
                    e.target.classList.add("hovered");
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDragLeave={function (e) {
                    e.target.classList.remove("hovered");
                  }}
                  onDrop={function (e) {
                    e.target.classList.remove("hovered");
                    if (!e.target.classList.contains("filled")) {
                      const card = document.querySelector(
                        "#" + e.dataTransfer.getData("id")
                      );
                      card.draggable = false;
                      e.target.appendChild(card);
                      e.target.classList.add("filled");
                      grid[rowIndex][columnIndex] = {
                        empty: false,
                        value: card.getAttribute("value"),
                        color: card.getAttribute("color"),
                        user: null,
                      };
                      setGrid(grid);
                      console.log(grid);
                    }
                  }}
                ></div>
              );
            })}
          </>
        );
      })}
    </div>
  );
};
export default Grid;
