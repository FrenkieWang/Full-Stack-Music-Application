const db = require('../db'); 

const getAllAlbums = (request, response) => {
  db.execute('SELECT * FROM Album')
    .then(([rows]) => response.json(rows))
    .catch(error => response.status(500).send(error.message));
};

const getAlbumById = (request, response) => {
  db.execute('SELECT * FROM Album WHERE album_id = ?', [request.params.album_id])
    .then(([rows]) => response.json(rows[0] || {}))
    .catch(error => response.status(500).send(error.message));
};

const createAlbum = (request, response) => {
  const { album_name, release_year, num_listens, artist_id } = request.body;
  db.execute('INSERT INTO Album (album_name, release_year, num_listens, artist_id) VALUES (?, ?, ?, ?)', 
    [album_name, release_year, num_listens, artist_id])
    .then(() => response.send('Album added successfully'))
    .catch(error => response.status(500).send(error.message));
};

const updateAlbum = (request, response) => {
  const { album_name, release_year, num_listens } = request.body;
  db.execute('UPDATE Album SET album_name = ?, release_year = ?, num_listens = ? WHERE album_id = ?', 
    [album_name, release_year, num_listens, request.params.album_id])
    .then(() => response.send('Album updated successfully'))
    .catch(error => response.status(500).send(error.message));
};

const deleteAlbum = (request, response) => {
  db.execute('DELETE FROM Album WHERE album_id = ?', [request.params.album_id])
    .then(() => response.send('Album deleted successfully'))
    .catch(error => response.status(500).send(error.message));
};

module.exports = { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };