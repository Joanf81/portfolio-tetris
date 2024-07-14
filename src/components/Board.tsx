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
  const styleBoardSize = {
    "--board-width": `${colsNumber * 40}px`,
  } as React.CSSProperties;

  const styleGridSize = {
    gridTemplateColumns: `repeat(${colsNumber}, minmax(0, 1fr))`,
  } as React.CSSProperties;
  return (
    <div className="relative  w-[var(--board-width)]" style={styleBoardSize}>
      {children}
      <div style={styleGridSize} className={`grid justify-start`}>
        {board.map((row) => {
          return row.map((blockType) => {
            return <Block type={blockType} />;
          });
        })}
      </div>
    </div>
  );
}
