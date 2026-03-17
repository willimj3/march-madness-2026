import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarchMadness2026 from "./MarchMadness2026";
import BracketPage from "./pages/BracketPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarchMadness2026 />} />
        <Route path="/bracket/:id" element={<BracketPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
