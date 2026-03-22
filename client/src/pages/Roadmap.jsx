import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/roadmap/me')
      .then((res) => setRoadmap(res.data.roadmap))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const regenerate = () => {
    setMsg('');
    api
      .post('/roadmap/regenerate')
      .then((res) => setRoadmap(res.data.roadmap))
      .catch(() => setMsg('Could not regenerate'))
      .finally(() => setLoading(false));
  };

  if (loading && !roadmap) return <p className="text-slate-400">Loading roadmap…</p>;
  const plan = roadmap?.plan;
  const currentSem = plan?.semesters?.find((s) => s.active) || plan?.semesters?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Your roadmap</h1>
          <p className="text-slate-400">JSON-backed, semester-wise structure. Update profile to shift focus.</p>
        </div>
        <button
          type="button"
          onClick={regenerate}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Regenerate from profile
        </button>
      </div>
      {msg && <p className="text-sm text-amber-400">{msg}</p>}

      {plan?.companyPaths?.length > 0 && (
        <Card title="Company-wise prep hints" subtitle="Based on your goal track.">
          <ul className="space-y-2 text-sm text-slate-300">
            {plan.companyPaths.map((c, i) => (
              <li key={i}>
                <span className="font-medium text-white">{c.company}:</span>{' '}
                {(c.focus || []).join(', ')}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {currentSem && (
        <Card title={`Semester ${currentSem.semester} snapshot`} subtitle={`Phase: ${currentSem.phase}`}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-brand-400">DSA</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {currentSem.dsa?.map((d) => (
                  <li key={d.key}>
                    {d.title} · {d.weeks}w
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brand-400">Core</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {currentSem.core?.map((c) => (
                  <li key={c.key}>
                    {c.title} ({c.depth})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brand-400">Aptitude</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {currentSem.aptitude?.map((a) => (
                  <li key={a.key}>{a.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brand-400">Projects</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
                {currentSem.projects?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <details className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-300">Full JSON plan (all semesters)</summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-400">
          {JSON.stringify(plan, null, 2)}
        </pre>
      </details>
    </div>
  );
}
