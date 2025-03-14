import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from "styled-components";

const HOST_URL = 'http://localhost:5000';
const SONG_API_URL = `${HOST_URL}/songs`;
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

function Song() {
  const [songs, setSongs] = useState([]); // Stores all songs
  const [form, setForm] = useState({ song_name: '', release_year: '', album_id: '' }); // Form data
  const [editingId, setEditingId] = useState(null); // Currently editing song ID

  const [albums, setAlbums] = useState([]); // Stores all albums
  const [artists, setArtists] = useState([]); // Stores all artists

  // Fetch all songs when the component loads
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    fetchArtists();
  }, []);

  const fetchSongs = () => {
    axios.get(`${SONG_API_URL}/get`)
      .then(response => setSongs(response.data))
      .catch(error => console.error(error));
  };

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
    if (!form.song_name || !form.release_year || 
    !form.album_id) {
      alert("Please type all required fields");
      return false;
    }
    return true;
  };

  // Create a new song
  const createSong = () => {
    if (!validateForm()) return;

    axios.post(`${SONG_API_URL}/create`, form)
      .then(response => {
        console.log(response.data);
        setForm({ song_name: '', release_year: '', album_id: '' }); // Clear form
        fetchSongs(); // Refresh song list
      })
      .catch(error => console.error(error));
  };

  // Get song details and fill the form for editing
  const editSong = (id) => {
    axios.get(`${SONG_API_URL}/get/${id}`)
      .then(response => {
        setForm(response.data);
        setEditingId(id);
      })
      .catch(error => console.error(error));
  };

  // Update an existing song
  const updateSong = () => {
    if (!validateForm()) return;
    
    axios.put(`${SONG_API_URL}/update/${editingId}`, form)
      .then(response => {
        console.log(response.data);
        setForm({ song_name: '', release_year: '', album_id: '' }); // Clear form
        setEditingId(null);
        fetchSongs(); // Refresh song list
      })
      .catch(error => console.error(error));
  };

  // Delete a song
  const deleteSong = (id) => {
    axios.delete(`${SONG_API_URL}/delete/${id}`)
      .then(response => {
        console.log(response.data);
        fetchSongs();
      }) // Refresh song list
      .catch(error => console.error(error));
  };

  return (
    <div className="song information">
      <h1>Song Management System</h1>
      <Link to="/">Back to HomePage</Link>
      <hr />

      {/* Form */}
      <div>
        <input
          type="text"
          name="song_name"
          placeholder="Song Name"
          value={form.song_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="release_year"
          placeholder="Release Year"
          value={form.release_year}
          onChange={handleChange}
          required
        />
        {/* Albums Selection List*/}
        <select 
          name="album_id" 
          value={form.album_id} 
          onChange={handleChange} 
          disabled={!!editingId} 
          required
        >
          <option value="">Select Album</option>
          {albums.map(album => (
            <option key={album.album_id} value={album.album_id}>
              {album.album_name}
            </option>
          ))}
        </select>

        {editingId ? (
          <button onClick={updateSong}>Update Song</button>
        ) : (
          <button onClick={createSong}>Add Song</button>
        )}
      </div>

      {/* Song List */}
      <h2>Song List</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Song Name</th>
            <th>Release Year</th>
            <th>Artist Name</th> 
            <th>Album Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {songs.map((song) => {
          const album = albums.find(a => a.album_id === song.album_id);
          const artist = artists.find(ar => ar.artist_id === album?.artist_id);
          
          return (
            <tr key={song.song_id}>
              <td>{song.song_id}</td>
              <td>{song.song_name}</td>
              <td>{song.release_year}</td>
              <td>{album?.album_name || "Unknown"}</td>
              <td>{artist?.artist_name || "Unknown"}</td>
              <td>
                <button onClick={() => editSong(song.song_id)}>Edit</button>
                <button onClick={() => deleteSong(song.song_id)}>Delete</button>
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default Song;