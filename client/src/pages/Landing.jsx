import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/Card.jsx';

export function Landing() {
  const { user } = useAuth();
  return (
    <div className="relative mx-auto mt-4 max-w-5xl px-4 py-16 sm:py-24">
      {/* Background glow effect for hero */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
      
      <div className="text-center animate-float">
        <div className="inline-flex items-center rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 backdrop-blur-sm mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-300">Phase 4 UI Polish Complete</span>
        </div>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight">
          Your AI-powered <br className="hidden sm:block" />
          <span className="text-gradient">placement cockpit</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300/90 sm:text-xl font-light">
          Dynamic roadmaps, timed tests, an AI mentor, and mock interviews — perfectly tuned to your branch, semester, and ultimate career goal.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-lg !px-8 !py-4 group">
              Enter Dashboard
              <svg className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg !px-8 !py-4 group">
                Get started free 
                <svg className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link to="/login" className="btn-secondary text-lg !px-8 !py-4">
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-32 grid gap-6 sm:grid-cols-3">
        <Card title="🎓 Smart Roadmap" subtitle="DSA, core, aptitude, and precise projects mapped by your semester." className="hover:border-brand-500/40 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-brand-500/10 blur-xl group-hover:bg-brand-500/20 transition-all" />
        </Card>
        <Card title="⚡ Mock Tests" subtitle="Realistic timer, automated scoring, and detailed answer explanations." className="hover:border-purple-500/40 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all" />
        </Card>
        <Card title="🤖 AI Powered" subtitle="Mentor chat, real-time interview coach, and ATS resume tips." className="hover:border-pink-500/40 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-pink-500/10 blur-xl group-hover:bg-pink-500/20 transition-all" />
        </Card>
      </div>
    </div>
  );
}
