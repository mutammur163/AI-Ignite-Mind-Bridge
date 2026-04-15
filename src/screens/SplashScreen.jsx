import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-accent-500/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div
        className={`flex flex-col items-center gap-6 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow">
            <span className="text-5xl select-none">🧠</span>
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-primary-400/40 animate-ping" />
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-gradient">Mind</span>
            <span className="text-white">Bridge</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 font-medium tracking-wide">
            Your daily mental wellness companion
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-white/20 text-xs font-medium tracking-widest uppercase">
        AI for Impact · Hackathon 2026
      </p>
    </div>
  );
}
