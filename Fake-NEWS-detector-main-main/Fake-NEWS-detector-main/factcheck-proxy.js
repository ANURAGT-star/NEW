import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const GOOGLE_API_KEY = process.env.GOOGLE_FACTCHECK_API_KEY;

app.get('/api/factcheck', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: 'API key not set on server' });

  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${GOOGLE_API_KEY}&query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Google Fact Check API' });
  }
});

app.listen(PORT, () => {
  console.log(`Fact Check Proxy server running on port ${PORT}`);
}); 