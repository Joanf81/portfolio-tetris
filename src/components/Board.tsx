import { PropsWithChildren } from "react";

import { boardColsNumber as colsNumber } from "../config";
import Block from "./Block";
import { blockType } from "../types";

interface boardProps {
  board: blockType[][];
}

export default function Board({
  children,
  board,
}: PropsWithChildren<boardProps>) {
  const style = {
    "--board-width": `${colsNumber * 40}px`,
    "grid-template-columns": `repeat(${colsNumber}, minmax(0, 1fr))`,
  } as React.CSSProperties;
  return (
    <div className="relative">
      {children}
      <div
        style={style}
        className={`grid justify-start w-[var(--board-width)]`}
      >
        {board.map((row) => {
          return row.map((blockType) => {
            return <Block type={blockType} />;
          });
        })}
      </div>
    </div>
  );
}
