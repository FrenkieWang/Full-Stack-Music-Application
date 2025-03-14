const express = require('express');
const { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } = require('../controllers/artistController');

const router = express.Router();

router.get('/get', getAllArtists);
router.get('/get/:artist_id', getArtistById);
router.post('/create', createArtist);
router.put('/update/:artist_id', updateArtist);
router.delete('/delete/:artist_id', deleteArtist);

module.exports = router;
