import { PropsWithChildren, createContext, useEffect, useReducer } from "react";
import { PieceColor, PieceMap, blockType, boardType, X } from "../types";
import { boardColsNumber, boardRowsNumber } from "../config";
import { log } from "../log.js";

// function addWallToBoard() {
//   const board = emptyBoard.map((row, y) => {
//     return row.map((element, x) => {
//       if (y > 5 && x === 8) {
//         return "red";
//       } else {
//         return element;
//       }
//     });
//   });

//   emptyBoard = board;
// }

function copyBoard(board: boardType) {
  return board.map((arr) => {
    return arr.slice();
  });
}

const emptyBoardLine: Array<blockType> = [];

for (let i = 0; i < boardColsNumber; i++) {
  if (i === 0 || i === boardColsNumber - 1) {
    emptyBoardLine.push("border");
  } else {
    emptyBoardLine.push("empty");
  }
}

// type boardActionType = { type: "something" };

function createEmptyBoard(): boardType {
  const emptyBoard: blockType[][] = [];

  for (let y = 0; y < boardRowsNumber; y++) {
    emptyBoard[y] = [];
    for (let x = 0; x < boardColsNumber; x++) {
      if (
        y == 0 ||
        x == 0 ||
        y == boardRowsNumber - 1 ||
        x == boardColsNumber - 1
      ) {
        emptyBoard[y][x] = "border";
      } else {
        emptyBoard[y][x] = "empty";
      }
    }
  }
  return emptyBoard;
}

export interface BoardContextType {
  board: boardType;
  emptyBoard: () => void;
  addPieceToBoard: (
    pieceMap: PieceMap,
    pieceX: number,
    pieceY: number,
    pieceColor: PieceColor
  ) => void;
}

export const BoardContext = createContext<BoardContextType>({
  board: [],
  emptyBoard: () => {},
  addPieceToBoard: () => {},
});

type emptyBoardAction = { type: "EMPTY_BOARD" };
type addPieceToBoardAction = {
  type: "ADD_PIECE";
  payload: {
    pieceMap: PieceMap;
    pieceX: number;
    pieceY: number;
    pieceColor: PieceColor;
  };
};
type emptyLinesFromBoardAction = {
  type: "EMPTY_LINE";
  payload: { line: number };
};

type boardActionType =
  | emptyBoardAction
  | addPieceToBoardAction
  | emptyLinesFromBoardAction;

function boardReducer(
  state: BoardContextType,
  action: boardActionType
): BoardContextType {
  let board: boardType = [];

  switch (action.type) {
    case "EMPTY_BOARD":
      board = createEmptyBoard();
      break;

    case "ADD_PIECE":
      board = copyBoard(state.board);
      const { pieceMap, pieceX, pieceY, pieceColor } = action.payload;

      pieceMap.forEach((row, posY) => {
        row.forEach((piece, poxX) => {
          if (piece === X) {
            board[pieceY + posY][pieceX + poxX] = pieceColor;
          }
        });
      });
      break;

    case "EMPTY_LINE":
      board = copyBoard(state.board);
      const { line } = action.payload;

      board.splice(line, 1);
      board.splice(1, 0, emptyBoardLine);
      break;
  }

  return { ...state, board: board };
}

export default function BoardContextProvider({ children }: PropsWithChildren) {
  log("<BoardContextProvider /> rendered", 0);

  const [boardState, boardDispatch] = useReducer(boardReducer, {
    board: createEmptyBoard(),
    emptyBoard: emptyBoard,
    addPieceToBoard: addPieceToBoard,
  });

  function emptyBoard() {
    boardDispatch({ type: "EMPTY_BOARD" });
  }

  function addPieceToBoard(
    pieceMap: PieceMap,
    pieceX: number,
    pieceY: number,
    pieceColor: PieceColor
  ) {
    boardDispatch({
      type: "ADD_PIECE",
      payload: {
        pieceMap: pieceMap,
        pieceX: pieceX,
        pieceY: pieceY,
        pieceColor: pieceColor,
      },
    });
  }

  function detectAndRemoveCompletedLines() {
    boardState.board.forEach((row, rowIndex) => {
      const rowWithoutBorders = row.slice(1, row.length - 1);
      if (rowWithoutBorders.every((e) => e != "border" && e != "empty"))
        boardDispatch({ type: "EMPTY_LINE", payload: { line: rowIndex } });
    });
  }

  useEffect(() => detectAndRemoveCompletedLines(), [boardState]);

  const boardContextValue: BoardContextType = {
    ...boardState,
    board: boardState.board,
  };

  return (
    <BoardContext.Provider value={boardContextValue}>
      {children}
    </BoardContext.Provider>
  );
}
