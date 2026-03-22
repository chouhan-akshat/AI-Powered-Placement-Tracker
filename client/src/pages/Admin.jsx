import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function Admin() {
  const [tests, setTests] = useState([]);
  const [msg, setMsg] = useState('');
  const [topicForm, setTopicForm] = useState({
    slug: '',
    title: '',
    category: 'dsa',
    description: '',
    order: 0,
  });
  const [testForm, setTestForm] = useState({
    title: '',
    type: 'aptitude',
    durationMinutes: 10,
    questionText: 'Sample question?',
    options: 'A,B,C,D',
    correctIndex: 0,
  });

  const load = () => {
    api.get('/admin/tests').then((res) => setTests(res.data.tests));
  };

  useEffect(() => {
    load();
  }, []);

  const addTopic = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/admin/topics', {
        ...topicForm,
        order: Number(topicForm.order),
        resources: [],
        practiceLinks: [],
      });
      setMsg('Topic created');
      setTopicForm({ slug: '', title: '', category: 'dsa', description: '', order: 0 });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  const addMiniTest = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const options = testForm.options.split(',').map((s) => s.trim());
      await api.post('/admin/tests', {
        title: testForm.title,
        type: testForm.type,
        durationMinutes: Number(testForm.durationMinutes),
        questions: [
          {
            text: testForm.questionText,
            options: options.length >= 2 ? options : ['A', 'B', 'C', 'D'],
            correctIndex: Number(testForm.correctIndex),
            explanation: 'Added from admin panel',
          },
        ],
      });
      setMsg('Test created');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-white">Admin</h1>
      {msg && <p className="text-sm text-amber-400">{msg}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Add topic">
          <form onSubmit={addTopic} className="space-y-3 text-sm">
            <input
              placeholder="slug-unique"
              value={topicForm.slug}
              onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              required
            />
            <input
              placeholder="Title"
              value={topicForm.title}
              onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              required
            />
            <select
              value={topicForm.category}
              onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              {['dsa', 'core', 'aptitude', 'project', 'system_design'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              rows={2}
            />
            <input
              type="number"
              placeholder="order"
              value={topicForm.order}
              onChange={(e) => setTopicForm({ ...topicForm, order: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
              Create topic
            </button>
          </form>
        </Card>

        <Card title="Add quick test (1 sample MCQ)">
          <form onSubmit={addMiniTest} className="space-y-3 text-sm">
            <input
              placeholder="Test title"
              value={testForm.title}
              onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              required
            />
            <select
              value={testForm.type}
              onChange={(e) => setTestForm({ ...testForm, type: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              <option value="aptitude">aptitude</option>
              <option value="technical">technical</option>
            </select>
            <input
              type="number"
              placeholder="duration min"
              value={testForm.durationMinutes}
              onChange={(e) => setTestForm({ ...testForm, durationMinutes: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            <input
              placeholder="Question"
              value={testForm.questionText}
              onChange={(e) => setTestForm({ ...testForm, questionText: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            <input
              placeholder="Options comma-separated"
              value={testForm.options}
              onChange={(e) => setTestForm({ ...testForm, options: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            <input
              type="number"
              min={0}
              max={3}
              placeholder="correct index 0-3"
              value={testForm.correctIndex}
              onChange={(e) => setTestForm({ ...testForm, correctIndex: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">
              Create test
            </button>
          </form>
        </Card>
      </div>

      <Card title="All tests (admin view)">
        <ul className="space-y-2 text-sm text-slate-300">
          {tests.map((t) => (
            <li key={t._id}>
              {t.title} — {t.type} — {t.questions?.length} Q
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
