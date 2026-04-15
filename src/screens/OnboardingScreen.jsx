import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const STEPS = 4;

export default function OnboardingScreen({ onComplete, t }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', ageGroup: '', language: 'English', initialFeeling: '' });

  const go = (direction) => setStep(s => Math.min(STEPS - 1, Math.max(0, s + direction)));
  const finish = () => onComplete(data);

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-gradient-hero">
      {/* ── Desktop left panel ── */}
      <div className="hidden lg:flex flex-col justify-center items-start px-16 py-12 w-96 xl:w-[440px] flex-shrink-0 border-r border-white/5">
        <div className="w-16 h-16 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow mb-6">
          <span className="text-3xl">🤝</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
          <span className="text-gradient">Mind</span>Bridge
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-10">
          AI-powered mental wellness companion for Indian youth. Private, free, and always here to listen.
        </p>
        {/* Feature list */}
        <div className="space-y-4">
          {[
            { emoji: '🔒', title: 'Private by design', desc: 'Your data never leaves your device' },
            { emoji: '🧠', title: 'AI-powered support', desc: 'Trained for empathy, not diagnosis' },
            { emoji: '🇮🇳', title: 'Culturally aware', desc: 'Hindi & English, built for India' },
            { emoji: '🆘', title: 'Crisis-safe', desc: 'Real helplines, one tap away' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{f.emoji}</span>
              <div>
                <p className="text-white/80 font-semibold text-sm">{f.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right / mobile form panel ── */}
      <div className="flex-1 flex flex-col relative">
        {/* Progress bar */}
        <div className="px-6 lg:px-10 pt-10 lg:pt-12">
          <div className="flex gap-1.5">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Back button */}
        {step > 0 && (
          <button onClick={() => go(-1)} className="absolute top-10 left-4 lg:left-8 p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Step content */}
        <div className="flex-1 px-6 lg:px-10 pt-8 pb-8 flex flex-col max-w-md lg:max-w-lg mx-auto w-full">
          {step === 0 && <Step0 t={t} onNext={() => go(1)} />}
          {step === 1 && <Step1 t={t} data={data} onChange={d => setData(p => ({ ...p, ...d }))} onNext={() => go(1)} />}
          {step === 2 && <Step2 t={t} data={data} onChange={d => setData(p => ({ ...p, ...d }))} onNext={() => go(1)} />}
          {step === 3 && <Step3 t={t} data={data} onChange={d => setData(p => ({ ...p, ...d }))} onFinish={finish} />}
        </div>
      </div>
    </div>
  );
}

function Step0({ t, onNext }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="relative lg:hidden">
        <div className="w-24 h-24 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow">
          <span className="text-5xl select-none">🤝</span>
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-primary-400/40 animate-ping" />
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-white">{t('welcome_heading')}</h2>
        <p className="text-white/60 text-base leading-relaxed max-w-xs mx-auto">{t('welcome_body')}</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
        {[
          { icon: '🔒', text: 'Private & confidential' },
          { icon: '🧠', text: 'AI-powered emotional support' },
          { icon: '🇮🇳', text: 'Built for Indian youth' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-3 glass px-4 py-3 text-left">
            <span className="text-xl">{item.icon}</span>
            <span className="text-white/70 text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="btn-primary w-full max-w-xs mt-2">{t('welcome_cta')}</button>
    </div>
  );
}

function Step1({ t, data, onChange, onNext }) {
  const canNext = data.name.trim().length >= 2 && data.ageGroup;
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-extrabold text-white">{t('name_heading')}</h2>
        <p className="text-white/40 text-sm mt-1">This stays on your device only.</p>
      </div>
      <input type="text" className="input-field text-lg" placeholder={t('name_placeholder')} value={data.name} onChange={e => onChange({ name: e.target.value })} maxLength={30} autoFocus />
      <div>
        <h2 className="text-2xl font-extrabold text-white mt-2">{t('age_heading')}</h2>
      </div>
      <div className="flex gap-3">
        {['14–17','18–22','23–28'].map(group => (
          <button key={group} onClick={() => onChange({ ageGroup: group })}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200 border ${data.ageGroup === group ? 'bg-primary-500 border-primary-500 text-white shadow-glow scale-105' : 'bg-surface-700 border-white/10 text-white/60 hover:border-primary-500/50'}`}>
            {group}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <button onClick={onNext} disabled={!canNext} className={`btn-primary w-full ${!canNext ? 'opacity-40 cursor-not-allowed' : ''}`}>
        {t('continue')}
      </button>
    </div>
  );
}

function Step2({ t, data, onChange, onNext }) {
  const langs = [{ id: 'English', emoji: '🇬🇧', label: 'English' }, { id: 'Hindi', emoji: '🇮🇳', label: 'हिंदी' }];
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <h2 className="text-2xl font-extrabold text-white">{t('lang_heading')}</h2>
      <div className="flex flex-col gap-3">
        {langs.map(l => (
          <button key={l.id} onClick={() => onChange({ language: l.id })}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-200 text-left ${data.language === l.id ? 'bg-primary-500/20 border-primary-500 shadow-glow' : 'bg-surface-700 border-white/10 hover:border-primary-500/30'}`}>
            <span className="text-3xl">{l.emoji}</span>
            <div>
              <p className="text-white font-bold text-lg">{l.label}</p>
              <p className="text-white/40 text-xs mt-0.5">Bridge will respond in {l.label}</p>
            </div>
            {data.language === l.id && <div className="ml-auto w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <button onClick={onNext} className="btn-primary w-full">{t('continue')}</button>
    </div>
  );
}

function Step3({ t, data, onChange, onFinish }) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-extrabold text-white">{t('feeling_heading')}</h2>
        <p className="text-white/40 text-sm mt-1">{t('feeling_subheading')}</p>
      </div>
      <textarea className="input-field resize-none h-40 text-base leading-relaxed" placeholder={t('feeling_placeholder')} value={data.initialFeeling} onChange={e => onChange({ initialFeeling: e.target.value })} maxLength={300} />
      <p className="text-white/20 text-xs text-right">{data.initialFeeling.length}/300</p>
      <div className="flex-1" />
      <div className="flex flex-col gap-3">
        <button onClick={onFinish} className="btn-primary w-full">{t('finish')}</button>
        <button onClick={() => { onChange({ initialFeeling: '' }); onFinish(); }} className="text-white/40 text-sm text-center py-2 hover:text-white/60 transition-colors">{t('skip')}</button>
      </div>
    </div>
  );
}
