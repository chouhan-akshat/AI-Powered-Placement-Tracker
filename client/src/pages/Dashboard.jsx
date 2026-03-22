import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';

export function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/progress/'), api.get('/roadmap/me')])
      .then(([p, r]) => {
        setProgress(p.data.progress);
        setRoadmap(r.data.roadmap?.plan);
      })
      .catch(() => {});
  }, []);

  const w = progress?.weekly;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Welcome back, <span className="text-gradient">{user?.name}</span>
        </h1>
        <div className="inline-flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-slate-300">
            {user?.branch}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-slate-300">
            Semester {user?.semester}
          </span>
          <span className="rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-brand-300">
            Goal: {user?.goal?.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Topic progress" subtitle="Mark topics done in the Topics tab.">
          {progress && (
            <ProgressBar value={progress.topicsCompleted} max={progress.topicsTotal || 1} label="Topics completed" />
          )}
        </Card>
        <Card title="Tests taken" subtitle="Aptitude & technical sprints.">
          <div className="flex items-end justify-between">
            {progress && (
              <p className="font-display text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">{progress.testsCompleted}</p>
            )}
            <Link to="/tests" className="inline-flex items-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Take a test <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </Card>
        <Card title="This week active target" subtitle="Targets you can edit in Progress.">
          {w && (
            <div className="space-y-4 mt-2">
              <ProgressBar value={w.completedTopics} max={w.targetTopics || 1} label="Topics" />
              <ProgressBar value={w.completedTests} max={w.targetTests || 1} label="Tests" />
            </div>
          )}
        </Card>
      </div>

      {roadmap?.summary && (
        <Card title="📌 Focus this semester" subtitle={roadmap.meta?.goalNarrative} className="border-l-4 border-l-brand-500">
          <p className="text-slate-200 text-lg font-medium">{roadmap.summary.focusThisSemester}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400/90">
            {(roadmap.summary.weeklySuggestion || []).map((s) => (
              <li key={s} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-white/5">
            <Link to="/roadmap" className="inline-flex items-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              View full interactive roadmap <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 pt-4">
        <Link to="/mentor" className="group">
          <Card title="🧠 Ask the AI Mentor" subtitle="What to study next, explain concepts… completely free and instantaneous!" className="h-full relative overflow-hidden border-brand-500/20 group-hover:border-brand-500/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300">
             <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl group-hover:bg-brand-500/20 transition-all" />
          </Card>
        </Link>
        <Link to="/mock-interview" className="group">
          <Card title="🎙️ AI Mock Interview" subtitle="Realtime-style verbal practice with instant scoring & feedback." className="h-full relative overflow-hidden border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300">
             <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
