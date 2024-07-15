interface PausedScreenProps {
  show: boolean;
  resumeGame(): void;
}

export default function PausedScreen({ show, resumeGame }: PausedScreenProps) {
  return (
    <div
      className={`z-40 absolute ${
        show ? "flex" : "hidden"
      } flex-col justify-center items-center space-y-12 w-full h-full bg-gray-600/70 `}
    >
      <p className="text-5xl text-gray-100">Game paused</p>
      <button
        className="px-10 py-4 text-gray-100 text-2xl border hover:bg-gray-600/70"
        onClick={resumeGame}
      >
        Resume
      </button>
    </div>
  );
}
