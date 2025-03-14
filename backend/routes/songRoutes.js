const express = require('express');
const { getAllSongs, getSongById, createSong, updateSong, deleteSong } = require('../controllers/songController');

const router = express.Router();

router.get('/get', getAllSongs);
router.get('/get/:song_id', getSongById);
router.post('/create', createSong);
router.put('/update/:song_id', updateSong);
router.delete('/delete/:song_id', deleteSong);

module.exports = router;
