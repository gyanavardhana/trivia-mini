import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Game from "./Components/Game/Game";
import EndGame from "./Components/EndGame/EndGame";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/endgame" element={<EndGame />} />
      </Routes>
    </>
  );
}

export default App;
