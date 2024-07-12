import Block from "./Block";

export default function Board() {
  const cols = 12;
  const rows = 22;

  const board: number[][] = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = 0;
    }
  }

  return (
    <>
      <div className="">
        <div
          className={`grid grid-cols-${cols} justify-start w-[${cols * 40}px]`}
        >
          {board.map((row, x) => {
            return row.map((element, y) => {
              // If border
              if (y == 0 || x == 0 || y == cols - 1 || x == rows - 1) {
                return <Block type="border" />;
              } else {
                return <Block type="background" />;
              }
            });
          })}
        </div>
      </div>
    </>
  );
}
