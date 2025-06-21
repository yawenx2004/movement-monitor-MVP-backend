const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello from backend!! :)' });
});

// in-memory store for location data
// to be replaced with DB in actual app
const locationData = {};
const lastActive = {};

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

// inactivity check
const INACTIVITY_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes
const areCoordsEqual = (a, b) => (
  a.latitude === b.latitude && a.longitude === b.longitude
);

setInterval(() => {
  const now = Date.now();

  for (const name in locationData) {
    const entries = locationData[name];
    if (entries.length < 2) continue;

    const lastEntry = entries[entries.length - 1];
    const prevEntry = entries[entries.length - 2];

    const lastTime = new Date(lastEntry.timestamp).getTime();

    const isStationary = areCoordsEqual(lastEntry.coords, prevEntry.coords);
    const isInactive = now - lastTime > INACTIVITY_THRESHOLD_MS;

    if (isStationary && isInactive) {
      console.warn(`🚨 ${name} has not moved in over 2 minutes!`);
      // TODO: send push notification + mock alert
    }
  }
}, 60 * 1000);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}...`);
});