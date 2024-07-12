import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";

function App() {
  return (
    <>
      <div className="bg-white">
        <Board>
          <ActivePiece />
        </Board>
      </div>
    </>
  );
}

export default App;
