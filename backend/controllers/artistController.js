const db = require('../db'); 

const getAllArtists = (request, response) => {
  db.execute('SELECT * FROM Artist')
    .then(([rows]) => response.json(rows))
    .catch(error => response.status(500).send(error.message));
};

const getArtistById = (request, response) => {
  db.execute('SELECT * FROM Artist WHERE artist_id = ?', [request.params.artist_id])
    .then(([rows]) => response.json(rows[0] || {}))
    .catch(error => response.status(500).send(error.message));
};

const createArtist = (request, response) => {
  const { artist_name, monthly_listeners, genre } = request.body;
  db.execute('INSERT INTO Artist (artist_name, monthly_listeners, genre) VALUES (?, ?, ?)', 
    [artist_name, monthly_listeners, genre])
    .then(() => response.send('Artist added successfully'))
    .catch(error => response.status(500).send(error.message));
};

const updateArtist = (request, response) => {
  const { artist_name, monthly_listeners, genre } = request.body;
  db.execute('UPDATE Artist SET artist_name = ?, monthly_listeners = ?, genre = ? WHERE artist_id = ?', 
    [artist_name, monthly_listeners, genre, request.params.artist_id])
    .then(() => response.send('Artist updated successfully'))
    .catch(error => response.status(500).send(error.message));
};

const deleteArtist = (request, response) => {
  db.execute('DELETE FROM Artist WHERE artist_id = ?', [request.params.artist_id])
    .then(() => response.send('Artist deleted successfully'))
    .catch(error => response.status(500).send(error.message));
};

module.exports = { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist };
