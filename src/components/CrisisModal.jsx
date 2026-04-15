import { Phone, MessageSquare, Heart, ArrowLeft } from 'lucide-react';

const RESOURCES = [
  { label: 'Call iCall — 9152987821', href: 'tel:9152987821', emoji: '💜', color: 'from-primary-600 to-primary-500' },
  { label: 'Vandrevala Foundation — 1860-2662-345', href: 'tel:18602662345', emoji: '💙', color: 'from-accent-600 to-accent-500' },
  { label: 'Tele MANAS (Govt.) — 14416', href: 'tel:14416', emoji: '🟠', color: 'from-orange-600 to-orange-500' },
];

export default function CrisisModal({ onClose, t }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Card */}
      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Soft glow background */}
        <div className="absolute -inset-4 rounded-[2.5rem] bg-primary-500/10 blur-2xl" />

        <div className="relative bg-surface-800 rounded-4xl p-7 border border-white/10 shadow-2xl">
          {/* Icon */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-brand flex items-center justify-center mx-auto mb-5 shadow-glow">
            <Heart size={28} className="text-white fill-white" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold text-white text-center leading-tight mb-3">
            {t('crisis_heading')}
          </h2>
          <p className="text-white/60 text-sm text-center leading-relaxed mb-7">
            {t('crisis_body')}
          </p>

          {/* Resource buttons */}
          <div className="flex flex-col gap-3">
            {RESOURCES.map(r => (
              <a
                key={r.href}
                href={r.href}
                className={`flex items-center gap-3 bg-gradient-to-r ${r.color} text-white font-semibold py-4 px-5 rounded-2xl active:scale-95 transition-transform shadow-md`}
              >
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm">{r.label}</span>
              </a>
            ))}

            <a
              href="https://icallhelpline.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-surface-700 text-white/80 font-semibold py-4 px-5 rounded-2xl active:scale-95 transition-all border border-white/10 hover:border-primary-500/40"
            >
              <MessageSquare size={18} className="flex-shrink-0 text-accent-400" />
              <span className="text-sm">iCall Online Chat — icallhelpline.org</span>
            </a>
          </div>

          {/* Back */}
          <button
            onClick={onClose}
            className="w-full mt-5 flex items-center justify-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors py-2"
          >
            <ArrowLeft size={14} />
            {t('crisis_back')}
          </button>

          {/* Reassurance */}
          <p className="text-white/20 text-xs text-center mt-4 leading-relaxed">
            🔒 This call is free & confidential. You deserve support.
          </p>
        </div>
      </div>
    </div>
  );
}
