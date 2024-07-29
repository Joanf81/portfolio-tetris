// Piece map:
export const X = "X";
export const O = "O";

export type Piece = "X" | "O";
export type PieceMap = Piece[][];
export type pieceMapListType = {
  [key in PiecePositionZType]: PieceMap;
};

export enum PiecePositionZType {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

// Piece type:
export const colorList = [
  "red",
  "orange",
  "green",
  "emerald",
  "light-blue",
  "dark-blue",
  "yellow",
  "pink",
  "purple",
];
export type PieceColor = (typeof colorList)[number];

// Other
export type TaildWindClass = string;

// General purpose types
export type Hash<K extends string, V> = {
  [key in K]?: V;
};
