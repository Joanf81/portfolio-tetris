import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";

function App() {
  return (
    <>
      <div className="bg-white">
        <Board>
          <ActivePiece positionX={2} positionY={1} />
        </Board>
      </div>
    </>
  );
}

export default App;
