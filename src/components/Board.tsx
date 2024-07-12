import { PropsWithChildren } from "react";

import {
  boardRowsNumber as rowsNumber,
  boardColsNumber as colsNumber,
} from "../config";
import Block from "./Block";

export default function Board({ children }: PropsWithChildren) {
  const board: number[][] = [];

  for (let i = 0; i < rowsNumber; i++) {
    board[i] = [];
    for (let j = 0; j < colsNumber; j++) {
      board[i][j] = 0;
    }
  }

  return (
    <div className="relative">
      {children}
      <div
        className={`grid grid-cols-${colsNumber} justify-start w-[${
          colsNumber * 40
        }px]`}
      >
        {board.map((row, x) => {
          return row.map((element, y) => {
            // If border
            if (
              y == 0 ||
              x == 0 ||
              y == colsNumber - 1 ||
              x == rowsNumber - 1
            ) {
              return <Block type="border" />;
            } else {
              return <Block type="background" />;
            }
          });
        })}
      </div>
    </div>
  );
}
