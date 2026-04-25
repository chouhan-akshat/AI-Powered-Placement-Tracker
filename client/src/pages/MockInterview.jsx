import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { api, getToken } from '../api.js';
import { Card } from '../components/Card.jsx';

// In production (Render), socket server is on the same origin as the page.
// In local dev, VITE_SOCKET_URL in client/.env overrides this (e.g. http://localhost:5000).
const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export function MockInterview() {
  const [mode, setMode] = useState('rest');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const socketRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const connectSocket = () => {
    const token = getToken();
    if (!token) return;
    const s = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socketRef.current = s;
    s.on('mock_interview:reply', ({ reply }) => {
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      setLoading(false);
    });
    s.on('mock_interview:error', ({ message }) => {
      setStatus(message);
      setLoading(false);
    });
    s.on('connect_error', () => {
      setStatus('Socket connection failed — use REST mode or check server.');
      setLoading(false);
    });
  };

  const sendRest = async (history) => {
    const { data } = await api.post('/ai/mock-interview', { messages: history });
    setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
  };

  const sendSocket = (history) => {
    const s = socketRef.current;
    if (!s?.connected) {
      setStatus('Not connected. Using REST Mode as fallback.');
      setMode('rest');
      sendRest(history).finally(() => setLoading(false));
      return;
    }
    s.emit('mock_interview:message', { messages: history });
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setStatus('');
    const history = next.map((m) => ({ role: m.role, content: m.content }));
    try {
      if (mode === 'socket') {
        if (!socketRef.current?.connected) connectSocket();
        sendSocket(history);
      } else {
        await sendRest(history);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: err.response?.data?.message || 'Request failed' },
      ]);
    } finally {
      if (mode !== 'socket') setLoading(false);
    }
  };

  const startInterview = async () => {
    setMessages([]);
    setLoading(true);
    setStatus('');
    try {
      if (mode === 'socket') {
        connectSocket();
        await new Promise((r) => setTimeout(r, 400));
        const { data } = await api.post('/ai/mock-interview', {
          messages: [{ role: 'user', content: 'Start the interview. Ask your first question.' }],
        });
        setMessages([{ role: 'assistant', content: data.reply }]);
      } else {
        const { data } = await api.post('/ai/mock-interview', {
          messages: [{ role: 'user', content: 'Start the interview. Ask your first question.' }],
        });
        setMessages([{ role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not start interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
           <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">AI Mock <span className="text-gradient">Interview</span></h1>
           <p className="text-slate-400 mt-1 text-lg">Simulate technical answers and receive instant scoring.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10 bg-slate-900/50 p-1">
            <button
              onClick={() => setMode('rest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'rest' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              REST
            </button>
            <button
              onClick={() => setMode('socket')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'socket' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Socket
            </button>
          </div>
          <button
            onClick={startInterview}
            className="btn-secondary !px-4 !py-2 text-xs"
          >
            New Session
          </button>
        </div>
      </div>
      
      {status && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {status}
        </div>
      )}
      
      <Card className="flex flex-1 flex-col p-0 overflow-hidden border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.05)] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/5 pointer-events-none" />
        
        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative z-10">
          {messages.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                 <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                 </div>
                 <p className="text-slate-400 text-lg">Click &quot;New session&quot; to begin your interview prep.</p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-purple-600/20 border border-purple-500/30 text-white rounded-tr-sm' 
                  : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 opacity-70">
                  {m.role === 'user' ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">You</span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11V7a2 2 0 114 0v4a2 2 0 11-4 0z"/></svg>
                       Interviewer
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap font-light prose prose-invert prose-p:leading-relaxed max-w-none">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-4 bg-slate-800/80 border border-white/5 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                 <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                 <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
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
              placeholder={messages.length > 0 ? "Type your answer..." : "Start a new session first"}
              disabled={messages.length === 0}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500 shadow-inner disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || messages.length === 0}
              className="bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-medium px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
