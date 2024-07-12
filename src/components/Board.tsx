import { PropsWithChildren } from "react";

import {
  boardRowsNumber as rowsNumber,
  boardColsNumber as colsNumber,
} from "../config";
import Block from "./Block";
import { blockType } from "../types";

interface boardProps {
  board: blockType[][];
}

export default function Board({
  children,
  board,
}: PropsWithChildren<boardProps>) {
  function renderBoard() {
    return board.map((row, x) => {
      return row.map((element, y) => {
        // If border
        if (y == 0 || x == 0 || y == colsNumber - 1 || x == rowsNumber - 1) {
          return <Block type="border" />;
        } else if (element === "red") {
          return <Block type="red" />;
        } else {
          return <Block type="empty" />;
        }
      });
    });
  }

  return (
    <div className="relative">
      {children}
      <div
        className={`grid grid-cols-${colsNumber} justify-start w-[${
          colsNumber * 40
        }px]`}
      >
        {renderBoard()}
      </div>
    </div>
  );
}
