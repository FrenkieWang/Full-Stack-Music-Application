const db = require('../db'); 

const getAllSongs = (request, response) => {
  db.execute('SELECT * FROM Song')
    .then(([rows]) => response.json(rows))
    .catch(error => response.status(500).send(error.message));
};

const getSongById = (request, response) => {
  db.execute('SELECT * FROM Song WHERE song_id = ?', [request.params.song_id])
    .then(([rows]) => response.json(rows[0] || {}))
    .catch(error => response.status(500).send(error.message));
};

const createSong = (request, response) => {
  const { song_name, release_year, album_id } = request.body;
  db.execute('INSERT INTO Song (song_name, release_year, album_id) VALUES (?, ?, ?)', [song_name, release_year, album_id])
    .then(() => response.send('Song added successfully'))
    .catch(error => response.status(500).send(error.message));
};

const updateSong = (request, response) => {
  const { song_name, release_year } = request.body;
  db.execute('UPDATE Song SET song_name = ?, release_year = ? WHERE song_id = ?', 
    [song_name, release_year, request.params.song_id])
    .then(() => response.send('Song updated successfully'))
    .catch(error => response.status(500).send(error.message));
};

const deleteSong = (request, response) => {
  db.execute('DELETE FROM Song WHERE song_id = ?', [request.params.song_id])
    .then(() => response.send('Song deleted successfully'))
    .catch(error => response.status(500).send(error.message));
};

module.exports = { getAllSongs, getSongById, createSong, updateSong, deleteSong };