export function Card({ title, subtitle, children, className = '' }) {
  return (
    <div
      className={`glass-card p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6 border-b border-white/5 pb-4">
          {title && <h3 className="font-display text-xl font-semibold text-white tracking-wide">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-400/80">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
