import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Song from "./pages/Song";
import Artist from "./pages/Artist";
import Album from "./pages/Album";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/song" element={<Song />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/album" element={<Album />} />
      </Routes>
    </Router>
  );
};

export default App;
