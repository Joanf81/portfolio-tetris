import { O, PieceMap, X, pieceMapListType } from "../types";

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

const listOfMaps: Array<pieceMapListType> = listOfPieces.map((piece) => {
  const rotated90 = rotateMatrix(piece);
  const rotated180 = rotateMatrix(rotated90);
  const rotated270 = rotateMatrix(rotated180);

  return { 0: piece, 1: rotated90, 2: rotated180, 3: rotated270 };
});

// Functions:

export function randomPieceMap(): pieceMapListType {
  return listOfMaps[Math.floor(Math.random() * listOfMaps.length) - 1];
}

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
