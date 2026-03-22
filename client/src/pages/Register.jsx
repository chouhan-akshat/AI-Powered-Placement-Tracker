import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';

const goals = [
  { value: 'general', label: 'General placement' },
  { value: 'service', label: 'Service companies' },
  { value: 'product', label: 'Product / startups' },
  { value: 'specific_role', label: 'Specific role' },
];

export function Register() {
  const { user, signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'CSE',
    semester: 5,
    goal: 'general',
    goalDetail: '',
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      await signup({
        ...form,
        semester: Number(form.semester),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card title="Create account" subtitle="We personalize your roadmap from this profile." className="w-full">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>}
          <div>
            <label className="text-xs text-slate-400">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Password (min 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Branch</label>
              <input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Semester</label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    Sem {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Goal</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
            >
              {goals.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          {form.goal === 'specific_role' && (
            <div>
              <label className="text-xs text-slate-400">Target role (optional)</label>
              <input
                value={form.goalDetail}
                onChange={(e) => setForm({ ...form, goalDetail: e.target.value })}
                placeholder="e.g. Backend intern"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-500 disabled:opacity-50"
          >
            {pending ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
