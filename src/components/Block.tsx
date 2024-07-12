import { blockSize } from "./../config";
import { blockType } from "../types";

interface BlockProps {
  type: blockType;
  absolute?: boolean;
  positionX?: number;
  positionY?: number;
}

export default function Block({
  type,
  absolute,
  positionX,
  positionY,
}: BlockProps) {
  let block;
  let absoluteClass;

  const x = (positionX || 0) * blockSize;
  const y = (positionY || 0) * blockSize;

  if (absolute) {
    absoluteClass = "absolute top-[var(--position-y)] left-[var(--position-x)]";
  }

  const style = {
    "--block-size": `${blockSize}px`,
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  switch (type) {
    case "red":
      block = (
        <div
          style={style}
          className={`${absoluteClass} w-[var(--block-size)] h-[var(--block-size)] border-4 border-red-800 bg-red-600`}
        ></div>
      );
      break;
    case "border":
      block = (
        <div
          style={style}
          className={`${absoluteClass} w-[var(--block-size)] h-[var(--block-size)] border-4 border-slate-600 bg-slate-400`}
        ></div>
      );
      break;
    case "empty":
      block = (
        <div
          style={style}
          className={`${absoluteClass} w-[var(--block-size)] h-[var(--block-size)] bg-black`}
        ></div>
      );
      break;
  }

  return block;
}
