import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';

const categories = [
  ['', 'All'],
  ['dsa', 'DSA'],
  ['core', 'Core'],
  ['aptitude', 'Aptitude'],
  ['project', 'Projects'],
];

export function Topics() {
  const { user, refreshUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(true);

  const completedSet = new Set(
    (user?.topicProgress || [])
      .filter((p) => p.completed)
      .map((p) => {
        const t = p.topic;
        if (t && typeof t === 'object' && t._id) return String(t._id);
        return String(t);
      })
  );

  useEffect(() => {
    setLoading(true);
    const q = cat ? `?category=${cat}` : '';
    api
      .get(`/topics${q}`)
      .then((res) => setTopics(res.data.topics))
      .finally(() => setLoading(false));
  }, [cat]);

  const toggle = async (topicId, completed) => {
    await api.post('/topics/progress', { topicId, completed });
    await refreshUser();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Topics</h1>
        <p className="text-slate-400">Resources, practice links, and completion tracking.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(([value, label]) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setCat(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              cat === value ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => {
            const done = completedSet.has(t._id);
            return (
              <Card key={t._id} title={t.title} subtitle={`${t.category} · sem hint ${t.semesterHint || '—'}`}>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/topics/${t.slug}`}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggle(t._id, !done)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      done ? 'bg-emerald-900/50 text-emerald-300' : 'border border-slate-600 text-slate-300'
                    }`}
                  >
                    {done ? 'Completed' : 'Mark complete'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
