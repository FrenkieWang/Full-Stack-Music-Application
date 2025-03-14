const express = require('express');
const { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumController');

const router = express.Router();

router.get('/get', getAllAlbums);
router.get('/get/:album_id', getAlbumById);
router.post('/create', createAlbum);
router.put('/update/:album_id', updateAlbum);
router.delete('/delete/:album_id', deleteAlbum);

module.exports = router;