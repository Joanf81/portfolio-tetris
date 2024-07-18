import Game from "./components/Game";
import BoardContextProvider from "./store/BoardContext";

export default function App() {
  return (
    <BoardContextProvider>
      <Game />
    </BoardContextProvider>
  );
}
