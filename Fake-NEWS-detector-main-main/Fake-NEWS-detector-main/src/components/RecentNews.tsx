import React, { useEffect, useState } from 'react';

interface Article {
  title: string;
  link: string;
  source: string;
  time: string;
}

export const RecentNews: React.FC<{ query: string }> = ({ query }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`http://localhost:5001/api/news?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">Recent News</h2>
      {loading ? (
        <div>Loading news...</div>
      ) : articles.length === 0 ? (
        <div className="text-muted-foreground">No recent news found.</div>
      ) : (
        <ul className="space-y-2">
          {articles.map((a, i) => (
            <li key={i} className="border rounded p-2 bg-card">
              <a href={a.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                {a.title}
              </a>
              <div className="text-xs text-muted-foreground">
                {a.source} {a.time && `• ${new Date(a.time).toLocaleString()}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 