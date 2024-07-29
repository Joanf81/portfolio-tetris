import Game from "./components/Game";
import GameContextProvider from "./store/GameContext";

export default function App() {
  return (
    <GameContextProvider>
      <Game />
    </GameContextProvider>
  );
}
