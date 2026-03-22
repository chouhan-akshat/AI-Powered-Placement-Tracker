import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';

export function TopicDetail() {
  const { slug } = useParams();
  const { user, refreshUser } = useAuth();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    api.get(`/topics/${slug}`).then((res) => setTopic(res.data.topic));
  }, [slug]);

  const tid = topic?._id?.toString();
  const progress = user?.topicProgress?.find((p) => {
    const t = p.topic;
    const id = t && typeof t === 'object' ? t._id?.toString() : String(t);
    return id === tid;
  });
  const done = progress?.completed;

  const toggle = async () => {
    if (!topic) return;
    await api.post('/topics/progress', { topicId: topic._id, completed: !done });
    await refreshUser();
  };

  if (!topic) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/topics" className="text-sm text-brand-400 hover:underline">
        ← All topics
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{topic.title}</h1>
          <p className="text-slate-400">{topic.category}</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            done ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
          }`}
        >
          {done ? 'Completed ✓' : 'Mark complete'}
        </button>
      </div>
      {topic.description && <p className="text-slate-300">{topic.description}</p>}

      <Card title="Resources">
        <ul className="space-y-2">
          {(topic.resources || []).map((r, i) => (
            <li key={i}>
              <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                {r.title || r.url}
              </a>
              <span className="ml-2 text-xs text-slate-500">{r.type}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Practice">
        <ul className="space-y-2">
          {(topic.practiceLinks || []).map((p, i) => (
            <li key={i}>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                {p.title || p.url}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
