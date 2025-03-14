import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from "styled-components";
import SongsModal from "./SongsModal";

const HOST_URL = process.env.REACT_APP_HOST_URL || 'https://cs230-lab3-backend.vercel.app';
const ALBUM_API_URL = `${HOST_URL}/albums`; 
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

function Album() {
  const [albums, setAlbums] = useState([]); // Stores all albums
  const [form, setForm] = useState({ album_name: '', artist_id: '', release_year: '', num_listens: '' }); // Form data
  const [editingId, setEditingId] = useState(null); // Stores the ID of the album being edited

  const [artists, setArtists] = useState([]); // Stores all artists

  const [songs, setSongs] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [showSongsModal, setShowSongsModal] = useState(false);

  // Fetch all albums and artists when the component loads
  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  const fetchAlbums = () => {
    axios.get(`${ALBUM_API_URL}/get`)
      .then(response => setAlbums(response.data))
      .catch(error => console.error(error));
  };

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
    if (!form.album_name || !form.artist_id || 
    !form.release_year || !form.num_listens) {
      alert("Please type all required fields");
      return false;
    }
    return true;
  };

  // Create a new album
  const createAlbum = () => {
    if (!validateForm()) return;

    axios.post(`${ALBUM_API_URL}/create`, form)
      .then(response => {
        console.log(response.data);
        setForm({ album_name: '', artist_id: '', release_year: '', num_listens: 0 }); // Clear form
        fetchAlbums(); // Refresh album list
      })
      .catch(error => console.error(error));
  };

  // Get album details and fill the form for editing
  const editAlbum = (id) => {
    axios.get(`${ALBUM_API_URL}/get/${id}`)
      .then(response => {
        setForm(response.data);
        setEditingId(id);
      })
      .catch(error => console.error(error));
  };

  // Update an existing album
  const updateAlbum = () => {
    if (!validateForm()) return;

    axios.put(`${ALBUM_API_URL}/update/${editingId}`, form)
      .then(response => {
        console.log(response.data);
        setForm({ album_name: '', artist_id: '', release_year: '', num_listens: 0 }); // Clear form
        setEditingId(null);
        fetchAlbums(); // Refresh album list
      })
      .catch(error => console.error(error));
  };

  // Delete an album
  const deleteAlbum = (id) => {
    axios.delete(`${ALBUM_API_URL}/delete/${id}`)
      .then(response => {
        console.log(response.data);
        fetchAlbums();
      }) // Refresh album list
      .catch(error => console.error(error));
  };

  const fetchSongs = (id) => {
    const theAlbum = albums.find(a => a.album_id === id);
    setSongs(JSON.parse(theAlbum.songlists || "[]"));
    setSelectedAlbum(theAlbum.album_name); 
    setShowSongsModal(true);
    window.scrollTo(0, 0); // Scroll Windows to to Top
  };

  return (
    <div className="album information">
      <h1>Album Management System</h1>
      <Link to="/">Back to HomePage</Link>
      <hr />

      {/* Form for creating/updating an album */}
      <div>
        <input
          type="text"
          name="album_name"
          placeholder="Album Name"
          value={form.album_name}
          onChange={handleChange}
          required
        />
        {/* Artists Selection List*/}
        <select 
          name="artist_id" 
          value={form.artist_id} 
          onChange={handleChange} 
          disabled={!!editingId} 
          required
        >
          <option value="">Select Artist</option>
          {artists.map(artist => (
            <option key={artist.artist_id} value={artist.artist_id}>
              {artist.artist_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="release_year"
          placeholder="Release Year"
          value={form.release_year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="num_listens"
          placeholder="Number of Listens"
          value={form.num_listens}
          onChange={handleChange}
        />

        {editingId ? (
          <button onClick={updateAlbum} disabled = {showSongsModal}>
            Update Album
          </button>
        ) : (
          <button onClick={createAlbum} disabled = {showSongsModal}>
            Add Album
          </button>
        )}
      </div>

      {/* Song Modal */}
      {showSongsModal && (
        <SongsModal
          type = "Album"
          title={selectedAlbum}
          songlists={songs}
          closeModal={() => setShowSongsModal(false)}
        />
      )}

      {/* Album List */}
      <h2>Album List</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Album Name</th>
            <th>Artist Name</th>
            <th>Release Year</th>
            <th>Number of Listens</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => {
            const artist = artists.find(ar => ar.artist_id === album?.artist_id);

            return(
              <tr key={album.album_id}>
              <td>{album.album_id}</td>
              <td>{album.album_name}</td>
              <td>{artist?.artist_name || "Unknown"}</td>
              <td>{album.release_year}</td>
              <td>{album.num_listens}</td>
              <td>
                <button onClick={() => editAlbum(album.album_id)}>Edit</button>
                <button onClick={() => deleteAlbum(album.album_id)}>Delete</button>
                <button onClick={() => fetchSongs(album.album_id)}>View Songs</button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Album;