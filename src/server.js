const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from backend!! :)');
});

// in-memory store for location data
// to be replaced with DB in actual app
const locationData = {};

// receive location updates
app.post('/location', (req, res) => {
    const { name, coords } = req.body;

    if (!name || !coords) {
        return res.status(400).json({ error: 'Missing name or coordinates' });
    }

    const entry = {
        timestamp: new Date().toISOString(),
        coords
    }

    if (!locationData[name]) {
        locationData[name] = [];
    }

    locationData[name].push(entry);

    console.log(`Logged location for ${name}:`, entry);

    res.status(200).json({ message: 'Location saved successfully' });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}...`);
});