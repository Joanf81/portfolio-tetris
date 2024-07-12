import { blockSize } from "./../config";

import Block from "./Block";

interface ActivePieceProps {
  positionX: number;
  positionY: number;
  onNewPiece(xSize: number, ySize: number): void;
}

export default function ActivePiece({
  positionX,
  positionY,
  onNewPiece,
}: ActivePieceProps) {
  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  onNewPiece(3, 2);

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
