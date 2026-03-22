import { useState, useRef, useEffect } from 'react';
import { api } from '../api.js';
import { Card } from '../components/Card.jsx';

export function Mentor() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me what to study next, or to explain OS, DBMS, DSA… I am here to help you secure your dream placement!' },
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const payload = [...messages, userMsg].filter((m) => m.role).map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/ai/mentor', { messages: payload });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: err.response?.data?.message || 'AI unavailable. Check API configuration.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">AI Placement <span className="text-gradient">Mentor</span></h1>
        <p className="text-slate-400 mt-1 text-lg">Context-aware help tailored to your branch, semester, and goals.</p>
      </div>
      
      <Card className="flex flex-1 flex-col p-0 overflow-hidden border-brand-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/5 pointer-events-none" />
        
        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative z-10">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-brand-600/20 border border-brand-500/30 text-white rounded-tr-sm' 
                  : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 opacity-70">
                  {m.role === 'user' ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-300">You</span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11V7a2 2 0 114 0v4a2 2 0 11-4 0z"/></svg>
                       AI Mentor
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap font-light prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 max-w-none">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-4 bg-slate-800/80 border border-white/5 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
               </div>
             </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div className="p-4 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl relative z-20">
          <form onSubmit={send} className="flex gap-3 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the AI Mentor..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary !px-6 !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
