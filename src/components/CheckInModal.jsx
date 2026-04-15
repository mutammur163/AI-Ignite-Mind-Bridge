import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getCheckInResponse } from '../services/claudeService';
import { saveMoodEntry } from '../utils/storage';
import { detectCrisisLocal } from '../services/claudeService';

const MOODS = [
  { score: 5, key: 'mood_great',      emoji: '😄', color: 'bg-mood-great',      border: 'border-mood-great',      text: '#4CAF50' },
  { score: 4, key: 'mood_good',       emoji: '🙂', color: 'bg-mood-good',       border: 'border-mood-good',       text: '#8BC34A' },
  { score: 3, key: 'mood_okay',       emoji: '😐', color: 'bg-mood-okay',       border: 'border-mood-okay',       text: '#FFC107' },
  { score: 2, key: 'mood_low',        emoji: '😔', color: 'bg-mood-low',        border: 'border-mood-low',        text: '#FF9800' },
  { score: 1, key: 'mood_struggling', emoji: '😰', color: 'bg-mood-struggling', border: 'border-mood-struggling', text: '#F44336' },
];

export default function CheckInModal({ onClose, onComplete, onCrisis, t, lang }) {
  const [step, setStep] = useState('mood');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedMood = MOODS.find(m => m.score === selected);

  const handleNext = async () => {
    if (!selected) return;
    if (note && detectCrisisLocal(note)) { onCrisis(); return; }

    setStep('response');
    setLoading(true);
    try {
      const response = await getCheckInResponse(selected, selectedMood.key, note, lang);
      setAiResponse(response);
      saveMoodEntry({ mood: selected, label: selectedMood.key, note });
    } catch {
      setAiResponse("I'm here with you. Whatever you're feeling right now is valid. 💜");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Full-screen overlay — centers a card on desktop, bottom sheet on mobile */
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet / card */}
      <div className="relative w-full lg:w-[520px] lg:max-h-[90vh] bg-surface-800 rounded-t-4xl lg:rounded-4xl px-6 pt-6 pb-10 lg:pb-8 animate-slide-up shadow-2xl overflow-y-auto">
        {/* Handle (mobile only) */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 lg:hidden" />

        {/* Close */}
        <button onClick={onClose} className="absolute top-6 right-6 p-1.5 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>

        {step === 'mood' && (
          <div className="animate-slide-up">
            <h3 className="text-2xl font-extrabold text-white mb-1">{t('how_feeling')}</h3>
            <p className="text-white/40 text-sm mb-6">Tap how you feel right now</p>

            <div className="flex flex-col gap-3">
              {MOODS.map(mood => {
                const label = t(mood.key);
                const isSelected = selected === mood.score;
                return (
                  <button key={mood.score} onClick={() => setSelected(mood.score)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      isSelected ? `${mood.border} bg-white/5 scale-[1.02]` : 'border-white/10 bg-surface-700 hover:border-white/20'
                    }`}>
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="font-bold text-base whitespace-pre-line" style={{ color: isSelected ? mood.text : 'rgba(255,255,255,0.7)' }}>
                      {label}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: mood.text }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="mt-5">
                <label className="block text-white/60 text-sm mb-2">{t('whats_going_on')}</label>
                <textarea className="input-field resize-none h-24 text-sm" placeholder={t('note_placeholder')} value={note} onChange={e => setNote(e.target.value.slice(0, 200))} />
                <p className="text-white/20 text-xs text-right mt-1">{note.length}/200</p>
              </div>
            )}

            <button onClick={handleNext} disabled={!selected}
              className={`btn-primary w-full mt-5 ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}>
              See what Bridge thinks →
            </button>
          </div>
        )}

        {step === 'response' && (
          <div className="animate-slide-up">
            {selectedMood && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{selectedMood.emoji}</span>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide">You felt</p>
                  <p className="font-bold text-white" style={{ color: selectedMood.text }}>{t(selectedMood.key)}</p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow">
                <span className="text-base">🤝</span>
              </div>
              <div className="glass px-4 py-3.5 flex-1 min-h-[80px]">
                {loading ? (
                  <div className="flex items-center gap-2 text-white/40">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">{t('getting_response')}</span>
                  </div>
                ) : (
                  <p className="text-white/90 text-sm leading-relaxed">{aiResponse}</p>
                )}
              </div>
            </div>
            {!loading && (
              <button onClick={() => onComplete({ mood: selected, label: selectedMood?.key })} className="btn-primary w-full mt-8">
                {t('done')} ✓
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
