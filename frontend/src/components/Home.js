import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home page">
      <nav>
        <Link to="/artist">Artist</Link><span> | </span>
        <Link to="/album">Album</Link><span> | </span>
        <Link to="/song">Song</Link>
      </nav>
      <h1>Welcome to the Music App's Home Page</h1>
      <h2>Please select a Page in Navbar</h2>
    </div>
  );
};

export default Home;
