import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function TakeTest() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [startTs, setStartTs] = useState(null);

  useEffect(() => {
    api.get(`/tests/${id}`).then((res) => {
      setTest(res.data.test);
      setAnswers(Array(res.data.test.questions?.length || 0).fill(-1));
      setSecondsLeft((res.data.test.durationMinutes || 15) * 60);
    });
  }, [id]);

  const submit = useCallback(async () => {
    if (!test) return;
    setError('');
    try {
      const durationSeconds = startTs ? Math.round((Date.now() - startTs) / 1000) : undefined;
      const { data } = await api.post(`/tests/${id}/submit`, { answers, durationSeconds });
      setResult(data.result);
    } catch (e) {
      setError(e.response?.data?.message || 'Submit failed');
    }
  }, [test, id, answers, startTs]);

  useEffect(() => {
    if (!started || result || !test) return;
    if (secondsLeft <= 0) {
      submit();
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft, result, test, submit]);

  const start = () => {
    setStarted(true);
    setStartTs(Date.now());
  };

  if (!test) return <p className="text-slate-400">Loading…</p>;

  if (result) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card title="Results" subtitle={`Score: ${result.score} / ${result.total} (${result.percentage}%)`}>
          <ul className="space-y-4 text-sm">
            {result.answers?.map((a, i) => (
              <li
                key={i}
                className={`rounded-lg border p-3 ${
                  a.correct ? 'border-emerald-800 bg-emerald-950/30' : 'border-red-900/50 bg-red-950/20'
                }`}
              >
                <p className="text-slate-300">Q{i + 1}</p>
                <p className="text-xs text-slate-500">
                  Your choice: {a.selectedIndex + 1} · Correct: {a.correctIndex + 1}
                </p>
                {a.explanation && <p className="mt-1 text-slate-400">{a.explanation}</p>}
              </li>
            ))}
          </ul>
          <Link to="/tests" className="mt-4 inline-block text-brand-400 hover:underline">
            Back to tests
          </Link>
        </Card>
      </div>
    );
  }

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/tests" className="text-sm text-brand-400 hover:underline">
          ← Tests
        </Link>
        {started && (
          <span className="rounded-lg bg-slate-800 px-3 py-1 font-mono text-brand-400">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </span>
        )}
      </div>
      <h1 className="font-display text-2xl font-bold text-white">{test.title}</h1>

      {!started ? (
        <Card title="Instructions">
          <p className="text-slate-300">Answer all questions. Timer starts when you begin. Auto-submits at 0:00.</p>
          <button
            type="button"
            onClick={start}
            className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-500"
          >
            Start
          </button>
        </Card>
      ) : (
        <>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {test.questions.map((q, qi) => (
            <Card key={q._id || qi} title={`Question ${qi + 1}`}>
              <p className="text-slate-200">{q.text}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 p-2 hover:bg-slate-800/50">
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                    />
                    <span className="text-slate-300">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            Submit answers
          </button>
        </>
      )}
    </div>
  );
}
