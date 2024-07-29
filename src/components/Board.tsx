import { PropsWithChildren, useContext } from "react";

import { boardColsNumber as colsNumber } from "../config";
import Block from "./Block";
import { log } from "../log.js";
import { GameContext } from "../store/GameContext.js";

export default function Board({ children }: PropsWithChildren) {
  log("<Board /> rendered", 2);

  const { board } = useContext(GameContext);

  const styleBoardSize = {
    "--board-width": `${colsNumber * 40}px`,
  } as React.CSSProperties;

  const styleGridSize = {
    gridTemplateColumns: `repeat(${colsNumber}, minmax(0, 1fr))`,
  } as React.CSSProperties;
  return (
    <div className="relative w-[var(--board-width)]" style={styleBoardSize}>
      {children}
      <div style={styleGridSize} className={`grid justify-start bg-black`}>
        {board.map((row) => {
          return row.map((blockType) => {
            return <Block type={blockType} />;
          });
        })}
      </div>
    </div>
  );
}
