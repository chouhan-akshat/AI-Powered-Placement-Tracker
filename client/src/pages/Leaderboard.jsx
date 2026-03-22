import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/results/leaderboard').then((res) => setRows(res.data.leaderboard || []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Leaderboard</h1>
      <p className="text-slate-400">Best score per user across all tests (MVP).</p>
      <Card title="Top performers">
        <ol className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.rank}
              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm"
            >
              <span className="text-slate-400">#{r.rank}</span>
              <span className="flex-1 px-3 text-white">{r.user?.name || 'Student'}</span>
              <span className="font-mono text-brand-400">{r.bestPercentage}%</span>
            </li>
          ))}
        </ol>
        {rows.length === 0 && <p className="text-slate-500">No results yet — take a test!</p>}
      </Card>
    </div>
  );
}
