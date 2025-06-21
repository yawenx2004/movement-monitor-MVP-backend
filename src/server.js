const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend!! :)' });
});

// in-memory stores
const locationData = {};
const lastMovedAt = {};
const userPushTokens = {};

const areCoordsEqual = (a, b) => (
  a.latitude === b.latitude && a.longitude === b.longitude
);

// receive location updates
app.post('/location', (req, res) => {
  const { name, coords } = req.body;

  if (!name || !coords) {
    return res.status(400).json({ error: 'Missing name or coordinates' });
  }

  const timestamp = new Date().toISOString();
  const entry = { timestamp, coords };

  if (!locationData[name]) {
    locationData[name] = [];
  }

  locationData[name].push(entry);

  if (!lastMovedAt[name]) {
    lastMovedAt[name] = new Date(timestamp).getTime();
  } else {
    const entries = locationData[name];
    if (entries.length >= 2) {
      const prevEntry = entries[entries.length - 2];
      if (!areCoordsEqual(prevEntry.coords, coords)) {
        lastMovedAt[name] = new Date(timestamp).getTime();
      }
    }
  }

  console.log(`Logged location for ${name}:`, entry);
  res.status(200).json({ message: 'Location saved successfully' });
});

// inactivity check
const STATIONARY_TIME_THRESHOLD_MS = 1 * 60 * 1000; // 1 minute

setInterval(() => {
  const now = Date.now();

  for (const name in locationData) {
    const entries = locationData[name];
    if (entries.length < 2) continue;

    const lastEntry = entries[entries.length - 1];
    const prevEntry = entries[entries.length - 2];

    const isStationary = areCoordsEqual(lastEntry.coords, prevEntry.coords);
    const stationarySince = lastMovedAt[name] || new Date(lastEntry.timestamp).getTime();
    const duration = now - stationarySince;

    if (isStationary && duration >= STATIONARY_TIME_THRESHOLD_MS) {
      console.log(`🚨 ${name} has not moved in over a minute! Alert sent to care circle.`);
      // TODO: Trigger alert or notification
    }
  }
}, 30 * 1000);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}...`);
});
