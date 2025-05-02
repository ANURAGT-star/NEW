import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/api/news', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const url = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    const $ = cheerio.load(html);

    const articles = [];
    $('article').each((_, el) => {
      const title = $(el).find('h3, h4').text();
      const link = 'https://news.google.com' + $(el).find('a').attr('href')?.replace('./', '/');
      const source = $(el).find('.wEwyrc').text();
      const time = $(el).find('time').attr('datetime') || '';
      if (title && link) {
        articles.push({ title, link, source, time });
      }
    });

    res.json({ articles: articles.slice(0, 3) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`News API server running on port ${PORT}`);
}); 