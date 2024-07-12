import { blockSize } from "./../config";

import Block from "./Block";

interface ActivePieceProps {
  positionX: number;
  positionY: number;
}

export default function ActivePiece({
  positionX,
  positionY,
}: ActivePieceProps) {
  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={`absolute top-[var(--position-y)] left-[var(--position-x)]`}
    >
      <div className="relative">
        <Block absolute positionX={0} positionY={0} type="red"></Block>
        <Block absolute positionX={1} positionY={0} type="red"></Block>
        <Block absolute positionX={2} positionY={0} type="red"></Block>
        <Block absolute positionX={0} positionY={1} type="red"></Block>
      </div>
    </div>
  );
}
