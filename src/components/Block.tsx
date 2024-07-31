import { blockSize } from "./../config";
import { TaildWindClass } from "../lib/types.js";
import { log } from "../log.js";
import { BlockType } from "../lib/block.js";

interface BlockProps {
  type: BlockType;
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
  log("<Block /> rendered", 4);

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
      colorClass = "border-red-800 bg-red-600";
      break;
    case "orange":
      colorClass = "border-orange-800 bg-orange-500";
      break;
    case "green":
      colorClass = "border-green-800 bg-green-600";
      break;
    case "emerald":
      colorClass = "border-emerald-800 bg-emerald-600";
      break;
    case "light-blue":
      colorClass = "border-cyan-700 bg-cyan-500";
      break;
    case "dark-blue":
      colorClass = "border-blue-800 bg-blue-600";
      break;
    case "yellow":
      colorClass = "border-yellow-800 bg-yellow-600";
      break;
    case "pink":
      colorClass = "border-pink-800 bg-pink-600";
      break;
    case "purple":
      colorClass = "border-purple-800 bg-purple-600";
      break;
    case "border":
      colorClass = "border-slate-600 bg-slate-400";
      break;
    case "empty":
      colorClass = "";
  }

  return (
    <div
      style={style}
      className={`${absoluteClass} w-[var(--block-size)] h-[var(--block-size)] ${colorClass} rounded-md shadow-[inset_-3px_-4px_6px_rgba(0,0,0,0.6)]`}
    ></div>
  );
}
