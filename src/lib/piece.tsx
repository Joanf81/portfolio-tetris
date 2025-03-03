export interface ActivePiece {
  maps: pieceMapList;
  color: PieceColor;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
}

// Piece map:
export const X = "X";
export const O = "O";

export type PieceMap = (typeof X | typeof O)[][];
export type pieceMapList = {
  [key in PiecePositionZType]: PieceMap;
};

// Position Z:
export enum PiecePositionZType {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

// Color:
const pieceColorList = [
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
export type PieceColor = (typeof pieceColorList)[number];

// Piece maps:
const pieceSquare: PieceMap = [
  [X, X],
  [X, X],
];

const pieceLong: PieceMap = [[X, X, X, X]];

const pieceT: PieceMap = [
  [O, X, O],
  [X, X, X],
];

const pieceL1: PieceMap = [
  [O, O, X],
  [X, X, X],
];

const pieceL2: PieceMap = [
  [X, O, O],
  [X, X, X],
];

const pieceS: PieceMap = [
  [O, X, X],
  [X, X, O],
];

const pieceZ: PieceMap = [
  [X, X, O],
  [O, X, X],
];

const listOfPieces = [
  pieceSquare,
  pieceLong,
  pieceT,
  pieceL1,
  pieceL2,
  pieceS,
  pieceZ,
];

const listOfMaps: Array<pieceMapList> = listOfPieces.map((piece) => {
  const rotated90 = rotateMatrix(piece);
  const rotated180 = rotateMatrix(rotated90);
  const rotated270 = rotateMatrix(rotated180);

  return { 0: piece, 1: rotated90, 2: rotated180, 3: rotated270 };
});

export function randomPieceMap(): pieceMapList {
  return listOfMaps[Math.floor(Math.random() * listOfMaps.length)];
}

// Colors
export function randomPieceColor(): PieceColor {
  return pieceColorList[Math.floor(Math.random() * pieceColorList.length)];
}

// Rotations
export function nextPositionZ(positionZ: PiecePositionZType) {
  switch (positionZ) {
    case PiecePositionZType.UP:
      return PiecePositionZType.RIGHT;
    case PiecePositionZType.RIGHT:
      return PiecePositionZType.DOWN;
    case PiecePositionZType.DOWN:
      return PiecePositionZType.LEFT;
    case PiecePositionZType.LEFT:
      return PiecePositionZType.UP;
  }
}

// Active piece generator
export function getResetedActivePiece() {
  return {
    positionX: 0,
    positionY: 0,
    positionZ: PiecePositionZType.UP,
    color: randomPieceColor(),
    maps: randomPieceMap(),
  };
}

// Matrix functions:
function copyMatrix(matrix: PieceMap) {
  return matrix.map((arr) => {
    return arr.slice();
  });
}

function transpose(matrix: PieceMap) {
  const newMatrix = copyMatrix(matrix);

  return newMatrix[0].map((col, i) => newMatrix.map((row) => row[i]));
}

function rotateMatrix(matrix: PieceMap): PieceMap {
  const newMatrix = transpose(matrix);
  newMatrix.forEach((row) => {
    row.reverse();
  });

  return newMatrix;
}
