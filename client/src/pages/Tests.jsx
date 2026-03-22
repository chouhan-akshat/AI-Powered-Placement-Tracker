import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function Tests() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    api.get('/tests/').then((res) => setTests(res.data.tests));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Mock tests</h1>
        <p className="text-slate-400">Timer-based MCQs with instant scoring.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((t) => (
          <Card key={t._id} title={t.title} subtitle={`${t.type} · ${t.durationMinutes} min · ${t.questions?.length || 0} Q`}>
            <Link
              to={`/tests/${t._id}`}
              className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
            >
              Start test
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
