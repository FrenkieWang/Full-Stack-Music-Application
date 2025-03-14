import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Song from "./components/Song";
import Artist from "./components/Artist";
import Album from "./components/Album";

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
