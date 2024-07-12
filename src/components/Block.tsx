import { blockSize } from "./../config";
import { TaildWindClass, blockType } from "../types";

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
  let absoluteClass: TaildWindClass = "";
  let colorClass: TaildWindClass;

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
      colorClass = "border-4 border-red-800 bg-red-600";
      break;
    case "border":
      colorClass = "border-4 border-slate-600 bg-slate-400";
      break;
    case "empty":
      colorClass = "bg-black";
  }

  return (
    <div
      style={style}
      className={`${absoluteClass} w-[var(--block-size)] h-[var(--block-size)] ${colorClass}`}
    ></div>
  );
}
