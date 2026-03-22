import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';

export function Resume() {
  const { refreshUser } = useAuth();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    api.get('/auth/me').then((res) => {
      setText(res.data.user?.resumeText || '');
    });
  }, []);

  const save = async () => {
    setSaveMsg('');
    await api.patch('/auth/me', { resumeText: text });
    await refreshUser();
    setSaveMsg('Profile resume text saved.');
  };

  const analyze = async () => {
    setLoading(true);
    setAnalysis('');
    try {
      const { data } = await api.post('/ai/resume', { text });
      setAnalysis(data.analysis);
    } catch (e) {
      setAnalysis(e.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Resume analyzer</h1>
      <p className="text-slate-400">Paste resume text; save to profile for one-click re-runs.</p>
      <Card title="Resume text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          placeholder="Paste plain text resume…"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Save to profile
          </button>
          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Analyze with AI'}
          </button>
        </div>
        {saveMsg && <p className="mt-2 text-sm text-emerald-400">{saveMsg}</p>}
      </Card>
      {analysis && (
        <Card title="AI feedback">
          <p className="whitespace-pre-wrap text-sm text-slate-300">{analysis}</p>
        </Card>
      )}
    </div>
  );
}
