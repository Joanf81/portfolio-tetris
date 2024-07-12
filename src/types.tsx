// Piece map:
export const X = "X";
export const O = "O";

export type Piece = "X" | "O";
export type PieceMap = Piece[][];

// Piece type:
export type PieceType = "red";
export type blockType = PieceType | "empty" | "border";
