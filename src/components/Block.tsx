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
  let colorClass: TaildWindClass = "";

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
    case "orange":
      colorClass = "border-4 border-orange-800 bg-orange-500";
      break;
    case "green":
      colorClass = "border-4 border-green-800 bg-green-600";
      break;
    case "emerald":
      colorClass = "border-4 border-emerald-800 bg-emerald-600";
      break;
    case "light-blue":
      colorClass = "border-4 border-cyan-700 bg-cyan-500";
      break;
    case "dark-blue":
      colorClass = "border-4 border-blue-800 bg-blue-600";
      break;
    case "yellow":
      colorClass = "border-4 border-yellow-800 bg-yellow-600";
      break;
    case "pink":
      colorClass = "border-4 border-pink-800 bg-pink-600";
      break;
    case "purple":
      colorClass = "border-4 border-purple-800 bg-purple-600";
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
