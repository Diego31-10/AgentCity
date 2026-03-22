/**
 * ClawCity - REST API
 * GET /states  → current agent states (for ESP32 integration)
 * GET /health  → health check
 */
import express from 'express';
import { getStates } from './stateManager.js';

const app = express();

app.get('/states', (req, res) => {
  res.json(getStates());
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clawcity' });
});

export function startApi(port = 5001) {
  const server = app.listen(port, () => {
    console.log(`🌐 API running at http://localhost:${port}/states`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} in use, skipping API server.`);
    } else {
      throw err;
    }
  });
}
