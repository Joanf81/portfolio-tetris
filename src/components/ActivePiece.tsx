import Block from "./Block";

interface ActivePieceProps {
  positionX: number;
  posiotionY: number;
}

export default function ActivePiece({
  positionX,
  posiotionY,
}: ActivePieceProps) {
  return (
    <div className="absolute">
      <div className="relative">
        <Block absolute type="red"></Block>
      </div>
    </div>
  );
}
