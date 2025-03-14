const express = require('express');
const cors = require('cors');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const songRoutes = require('./routes/songRoutes');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);

app.use((request, response) => response.status(404).send('Path Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));