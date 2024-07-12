import { blockSize } from "./../config";

interface BlockProps {
  type: "border" | "background" | "red";
  absolute: boolean;
}

export default function Block({ type, absolute }: BlockProps) {
  const blockDimensionsClass = `w-[${blockSize}px] h-[${blockSize}px]`;
  let block;

  switch (type) {
    case "red":
      block = (
        <div
          className={`${absolute} ${blockDimensionsClass} border-4 border-red-800 bg-red-600`}
        ></div>
      );
      break;
    case "border":
      block = (
        <div
          className={`${absolute} ${blockDimensionsClass} border-4 border-slate-600 bg-slate-400`}
        ></div>
      );
      break;
    case "background":
      block = (
        <div className={`${absolute} ${blockDimensionsClass} bg-black`}></div>
      );
      break;
  }

  return block;
}
