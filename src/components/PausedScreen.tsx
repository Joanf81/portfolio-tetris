import { log } from "../log.js";

interface PausedScreenProps {
  onRestart: () => void;
}

export default function PausedScreen({ onRestart }: PausedScreenProps) {
  log("<PausedScreen /> rendered", 4);

  return (
    <div
      className={`z-40 absolute flex flex-col justify-center items-center space-y-12 w-full h-full bg-gray-600/70 `}
    >
      <p className="text-5xl text-gray-100">Game paused</p>
      <button
        className="px-10 py-4 text-gray-100 text-2xl border hover:bg-gray-600/70"
        onClick={onRestart}
      >
        Resume
      </button>
    </div>
  );
}
