import { useState } from 'react';
import { ArrowLeft, Phone, MessageSquare, Globe } from 'lucide-react';
import resources from '../data/resources.json';

const FILTERS = [
  { id: 'all',   label: 'filter_all' },
  { id: 'free',  label: 'filter_free' },
  { id: '24x7',  label: 'filter_24x7' },
  { id: 'hindi', label: 'filter_hindi' },
];

const COLOR_MAP = {
  '#7C4DFF': { bg: 'bg-primary-500/15', border: 'border-primary-500/40', text: 'text-primary-300', btn: 'bg-primary-500 hover:bg-primary-600' },
  '#00BCD4': { bg: 'bg-accent-500/15',  border: 'border-accent-500/40',  text: 'text-accent-400',  btn: 'bg-accent-500 hover:bg-accent-600' },
  '#FF9800': { bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  text: 'text-orange-300',  btn: 'bg-orange-500 hover:bg-orange-600' },
  '#4CAF50': { bg: 'bg-green-500/15',   border: 'border-green-500/40',   text: 'text-green-300',   btn: 'bg-green-600 hover:bg-green-700' },
};

export default function ResourcesScreen({ onBack, t }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered = activeFilter === 'all' ? resources : resources.filter(r => r.tags.includes(activeFilter));

  return (
    <div className="min-h-dvh lg:min-h-0 flex flex-col bg-surface-900 pb-20 lg:pb-8 overflow-y-auto">
      {/* Header */}
      <div className="px-5 lg:px-8 pt-10 lg:pt-8 pb-4 bg-surface-800 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="lg:hidden p-2 -ml-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-extrabold text-white">{t('resources_title')}</h1>
            <p className="text-white/40 text-xs mt-0.5">{t('resources_subtitle')}</p>
          </div>
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === f.id ? 'bg-primary-500 text-white shadow-glow' : 'bg-surface-700 text-white/50 hover:text-white/70 border border-white/10'
              }`}>
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 lg:px-8 py-5 lg:py-8 overflow-y-auto">
        {/* Emergency banner */}
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-5">
          <span className="text-xl">🚨</span>
          <div>
            <p className="text-red-300 text-sm font-semibold">In immediate danger?</p>
            <p className="text-white/40 text-xs">Call emergency services: <span className="font-bold text-white/60">112</span></p>
          </div>
        </div>

        {/* Cards — 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(r => {
            const colors = COLOR_MAP[r.color] || COLOR_MAP['#7C4DFF'];
            return (
              <div key={r.id} className={`card border ${colors.border} ${colors.bg} flex flex-col`}>
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: r.color + '25' }}>
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-base">{r.name}</h3>
                      {r.tags.includes('24x7') && (
                        <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-500/30">24×7</span>
                      )}
                      {r.tags.includes('free') && (
                        <span className="bg-accent-500/20 text-accent-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-accent-500/30">Free</span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{r.org}</p>
                    <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{r.description}</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-white/40 text-xs">{r.availability}</p>
                </div>

                {/* Language tags */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {r.tags.filter(tag => ['hindi','english'].includes(tag)).map(tag => (
                    <span key={tag} className="text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 capitalize">{tag}</span>
                  ))}
                  {r.tags.includes('chat') && (
                    <span className="text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full border border-accent-500/20">💬 Chat</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  {r.type === 'call' && (
                    <a href={`tel:${r.contact.replace(/[^0-9]/g, '')}`}
                      className={`flex-1 flex items-center justify-center gap-2 ${colors.btn} text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-95`}>
                      <Phone size={15} />{t('call')}
                    </a>
                  )}
                  {r.type === 'chat' && (
                    <a href={r.website} target="_blank" rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-2 ${colors.btn} text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-95`}>
                      <MessageSquare size={15} />{t('chat')}
                    </a>
                  )}
                  <a href={r.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center bg-surface-700 text-white/60 py-3 px-4 rounded-2xl text-sm hover:text-white transition-all active:scale-95 border border-white/10">
                    <Globe size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-white/15 text-xs text-center pt-5">
          MindBridge is a support companion, not a medical service. Always consult a qualified professional for diagnosis or treatment.
        </p>
      </div>
    </div>
  );
}
