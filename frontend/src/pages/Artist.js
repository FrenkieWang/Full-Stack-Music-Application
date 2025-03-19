import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from "styled-components";
import SongsModal from "./SongsModal";
import AlbumsModal from "./AlbumsModal";

const HOST_URL = process.env.REACT_APP_HOST_URL || 'http://localhost:5000';
const ARTIST_API_URL = `${HOST_URL}/artists`; 

const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;

  th, td {
    border: 1px solid black;
    padding: 8px;
  }
`;

function Artist() {
  const [artists, setArtists] = useState([]); // Stores all artists
  const [form, setForm] = useState({ artist_name: '', monthly_listeners: '', genre: '' }); // Form data
  const [editingId, setEditingId] = useState(null); // Stores the ID of the artist being edited

  const [songs, setSongs] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [showSongsModal, setShowSongsModal] = useState(false);

  const [albums, setAlbums] = useState([]); 
  const [showAlbumsModal, setShowAlbumsModal] = useState(false); 

  // Fetch all artists when the component loads
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = () => {
    axios.get(`${ARTIST_API_URL}/get`)
      .then(response => setArtists(response.data))
      .catch(error => console.error(error));
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate Input before Submit
  const validateForm = () => {
    if (!form.artist_name || 
    !form.monthly_listeners || !form.genre) {
      alert("Please type all required fields");
      return false;
    }
    return true;
  };

  // Create a new artist
  const createArtist = () => {
    if (!validateForm()) return;

    axios.post(`${ARTIST_API_URL}/create`, form)
      .then(response => {
        console.log(response.data);
        setForm({ artist_name: '', monthly_listeners: '', genre: '' }); // Clear form
        fetchArtists(); // Refresh artist list
      })
      .catch(error => console.error(error));
  };

  // Get artist details and fill the form for editing
  const editArtist = (id) => {
    axios.get(`${ARTIST_API_URL}/get/${id}`)
      .then(response => {
        setForm(response.data);
        setEditingId(id);
      })
      .catch(error => console.error(error));
  };

  // Update an existing artist
  const updateArtist = () => {
    if (!validateForm()) return;

    axios.put(`${ARTIST_API_URL}/update/${editingId}`, form)
      .then(response => {
        console.log(response.data);
        setForm({ artist_name: '', monthly_listeners: '', genre: '' }); // Clear form
        setEditingId(null);
        fetchArtists(); // Refresh artist list
      })
      .catch(error => console.error(error));
  };

  // Delete an artist
  const deleteArtist = (id) => {
    axios.delete(`${ARTIST_API_URL}/delete/${id}`)
      .then(response => {
        console.log(response.data);
        fetchArtists();
      }) // Refresh artist list
      .catch(error => console.error(error));
  };

  const fetchSongs = (id) => {
    const theArtist = artists.find(a => a.artist_id === id);
    setSongs(JSON.parse(theArtist.songlists || "[]"));
    setSelectedArtist(theArtist.artist_name);  
    setShowSongsModal(true);
    setShowAlbumsModal(false);
    window.scrollTo(0, 0); // Scroll Windows to to Top
  };

  const fetchAlbums = (id) => {
    const theArtist = artists.find(a => a.artist_id === id);
    setAlbums(JSON.parse(theArtist.albumlists || "[]"));
    setSelectedArtist(theArtist.artist_name); 
    setShowAlbumsModal(true);
    setShowSongsModal(false);
    window.scrollTo(0, 0); // Scroll Windows to to Top
  };

  return (
    <div className="artist information">
      <h1>Artist Management System</h1>
      <Link to="/">Back to HomePage</Link>
      <hr />

      {/* Form for creating/updating an artist */}
      <div>
        <input
          type="text"
          name="artist_name"
          placeholder="Artist Name"
          value={form.artist_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="monthly_listeners"
          placeholder="Monthly Listeners"
          value={form.monthly_listeners}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
        />

        {editingId ? (
          <button onClick={updateArtist} disabled = {showSongsModal || showAlbumsModal}>
            Update Artist
          </button>
        ) : (
          <button onClick={createArtist} disabled = {showSongsModal || showAlbumsModal}>
            Add Artist
          </button>
        )}
      </div>

      {/* Song Modal */}
      {showSongsModal && (
        <SongsModal
          type = "Artist"
          title={selectedArtist}
          songlists={songs}
          closeModal={() => setShowSongsModal(false)}
        />
      )}

      {/* Album Modal */}
      {showAlbumsModal && (
        <AlbumsModal
          type = "Artist"
          title={selectedArtist}
          albumlists={albums}
          closeModal={() => setShowAlbumsModal(false)}
        />
      )}

      {/* Artist List */}
      <h2>Artist List</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artist Name</th>
            <th>Monthly Listeners</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.artist_id}>
              <td>{artist.artist_id}</td>
              <td>{artist.artist_name}</td>
              <td>{artist.monthly_listeners}</td>
              <td>{artist.genre}</td>
              <td>
                <button onClick={() => editArtist(artist.artist_id)}>Edit</button>
                <button onClick={() => deleteArtist(artist.artist_id)}>Delete</button>
                <button onClick={() => fetchSongs(artist.artist_id)}>View Songs</button>
                <button onClick={() => fetchAlbums(artist.artist_id)}>View Albums</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Artist;