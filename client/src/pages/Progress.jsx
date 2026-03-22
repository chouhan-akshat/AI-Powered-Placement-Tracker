import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';

export function Progress() {
  const [data, setData] = useState(null);
  const [targets, setTargets] = useState({ targetTopics: 3, targetTests: 1 });
  const [saved, setSaved] = useState(false);

  const load = () => {
    api.get('/progress/').then((res) => {
      setData(res.data.progress);
      const w = res.data.progress?.weekly;
      if (w) setTargets({ targetTopics: w.targetTopics, targetTests: w.targetTests });
    });
  };

  useEffect(() => {
    load();
  }, []);

  const saveWeekly = async () => {
    await api.patch('/progress/weekly', targets);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  if (!data) return <p className="text-slate-400">Loading…</p>;
  const w = data.weekly;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Progress</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Overall topics" subtitle={`${data.topicsCompleted} / ${data.topicsTotal} completed`}>
          <ProgressBar value={data.topicsCompleted} max={data.topicsTotal || 1} />
        </Card>
        <Card title="Tests completed" subtitle="All-time submissions">
          <p className="text-4xl font-bold text-white">{data.testsCompleted}</p>
        </Card>
      </div>

      <Card title="Weekly goals" subtitle="Week starts Sunday (server local time).">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Target topics / week</label>
            <input
              type="number"
              min={1}
              value={targets.targetTopics}
              onChange={(e) => setTargets({ ...targets, targetTopics: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Target tests / week</label>
            <input
              type="number"
              min={1}
              value={targets.targetTests}
              onChange={(e) => setTargets({ ...targets, targetTests: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveWeekly}
          className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          Save weekly targets
        </button>
        {saved && <p className="mt-2 text-sm text-emerald-400">Saved.</p>}
        <div className="mt-6 space-y-4">
          <ProgressBar value={w.completedTopics} max={w.targetTopics || 1} label="Topics this week" />
          <ProgressBar value={w.completedTests} max={w.targetTests || 1} label="Tests this week" />
        </div>
      </Card>

      <Card title="Recent test results">
        <ul className="space-y-2 text-sm">
          {(data.recentTests || []).map((r) => (
            <li key={r._id} className="flex justify-between border-b border-slate-800 py-2 text-slate-300">
              <span>{r.test?.title || 'Test'}</span>
              <span className="text-brand-400">{r.percentage}%</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
