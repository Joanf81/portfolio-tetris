import Game from "./components/Game";
import ActivePieceContextProvider from "./store/ActivePieceContext";
import BoardContextProvider from "./store/BoardContext";

export default function App() {
  return (
    <BoardContextProvider>
      <ActivePieceContextProvider>
        <Game />
      </ActivePieceContextProvider>
    </BoardContextProvider>
  );
}
