# Backend for Lowkey Movement Monitor MVP

Deployed URL: [Render link](https://movement-monitor-mvp-backend.onrender.com/)

## ⭐ Usage
 - Stores location **every minute** (for testing purposes)
 - Uses a function to check for movement
    - TODO: Add a threshold for movement differences. Currently inactivity is reported when the coordinates are **exactly equal**.

## ⌨️ Tech Stack
- Express
- Node.js
- Currently DB is in local storage; in the final version it will be on something like Firebase.