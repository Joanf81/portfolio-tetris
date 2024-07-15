// Piece map:
export const X = "X";
export const O = "O";

export type Piece = "X" | "O";
export type PieceMap = Piece[][];

export enum PiecePositionZType {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

// Piece type:
export type PieceType = "red";
export type blockType = PieceType | "empty" | "border";

// Other
export type TaildWindClass = string;

// General purpose types
export type Hash<K extends string, V> = {
  [key in K]?: V;
};
