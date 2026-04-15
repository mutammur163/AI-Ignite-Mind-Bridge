import { useState, useEffect } from 'react';
import { MessageCircle, BarChart2, LifeBuoy, ChevronRight, Flame } from 'lucide-react';
import { getStreak, checkedInToday } from '../utils/storage';

const PSYCH_CARDS = {
  English: [
    { emoji: '💪', text: 'Anxiety isn\'t weakness. It\'s your brain being overprotective.', color: 'from-primary-600/30 to-primary-500/10' },
    { emoji: '🗣️', text: 'Talking about how you feel is one of the bravest things you can do.', color: 'from-accent-600/30 to-accent-500/10' },
    { emoji: '👥', text: '1 in 5 young Indians feels the same way you do right now.', color: 'from-green-600/30 to-green-500/10' },
    { emoji: '😴', text: 'Sleep and mood are deeply connected. Even small changes help.', color: 'from-orange-600/30 to-orange-500/10' },
    { emoji: '🧠', text: 'Your mental health matters as much as your physical health. Always.', color: 'from-purple-600/30 to-purple-500/10' },
  ],
  Hindi: [
    { emoji: '💪', text: 'चिंता कमज़ोरी नहीं है। यह आपका दिमाग आपको बचाने की कोशिश करता है।', color: 'from-primary-600/30 to-primary-500/10' },
    { emoji: '🗣️', text: 'अपनी भावनाओं के बारे में बात करना सबसे साहसी काम है।', color: 'from-accent-600/30 to-accent-500/10' },
    { emoji: '👥', text: 'हर 5 में से 1 भारतीय युवा आज आपकी तरह महसूस कर रहा है।', color: 'from-green-600/30 to-green-500/10' },
    { emoji: '😴', text: 'नींद और मूड गहराई से जुड़े हैं। छोटे बदलाव भी मदद करते हैं।', color: 'from-orange-600/30 to-orange-500/10' },
    { emoji: '🧠', text: 'मानसिक स्वास्थ्य उतना ही महत्वपूर्ण है जितना शारीरिक स्वास्थ्य।', color: 'from-purple-600/30 to-purple-500/10' },
  ],
};

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t('home_greeting_morning');
  if (hour < 17) return t('home_greeting_afternoon');
  if (hour < 20) return t('home_greeting_evening');
  return t('home_greeting_night');
}

const MOOD_EMOJIS = { 5: '😄', 4: '🙂', 3: '😐', 2: '😔', 1: '😰' };
const MOOD_LABELS = { 5: 'Great', 4: 'Good', 3: 'Okay', 2: 'Low', 1: 'Really Struggling' };

export default function HomeScreen({
  userName, lang, t,
  onCheckIn, onChat, onDashboard, onResources, lastMood,
}) {
  const streak = getStreak();
  const didCheckIn = checkedInToday();
  const [cardIndex, setCardIndex] = useState(0);
  const cards = PSYCH_CARDS[lang] || PSYCH_CARDS.English;
  const greeting = getGreeting(t);

  useEffect(() => {
    const timer = setInterval(() => setCardIndex(i => (i + 1) % cards.length), 6000);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="min-h-dvh lg:min-h-0 flex flex-col bg-gradient-hero pb-20 lg:pb-8 overflow-y-auto">
      {/* ── Header ── */}
      <div className="px-5 lg:px-8 pt-10 lg:pt-8 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/40 text-sm font-medium">{greeting} 👋</p>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
              {userName || 'friend'}
            </h1>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 rounded-2xl px-3 py-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-orange-300 font-bold text-sm">{streak}</span>
              <span className="text-orange-400/60 text-xs">{t('streak')}</span>
            </div>
          )}
        </div>
        <p className="text-white/20 text-xs mt-3">{t('privacy_note')}</p>
      </div>

      {/* ── Desktop two-column layout ── */}
      <div className="px-5 lg:px-8 flex-1 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">

        {/* Left column on desktop */}
        <div className="space-y-5">
          {/* Check-in card */}
          {didCheckIn && lastMood ? (
            <div className="card border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{MOOD_EMOJIS[lastMood.mood] || '✓'}</span>
                <div>
                  <p className="text-green-300 font-semibold text-sm">{t('checked_in')}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    You felt <span className="text-white/60">{MOOD_LABELS[lastMood.mood] || lastMood.label}</span> today
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onCheckIn}
              className="w-full bg-gradient-brand rounded-3xl p-6 text-left shadow-glow relative overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/5 blur-xl" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">{t('check_in_title')}</p>
              <p className="text-white font-extrabold text-xl lg:text-2xl leading-tight">{t('check_in_cta')}</p>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-white/60 text-xs">Takes less than 60 seconds</span>
                <ChevronRight size={14} className="text-white/40" />
              </div>
            </button>
          )}

          {/* Quick actions — 3 cols on mobile, horizontal on desktop */}
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-3">
            <QuickAction icon={<MessageCircle size={22} />} label={t('talk_to_bridge')} color="bg-primary-500/20 border-primary-500/30 text-primary-300" onClick={onChat} />
            <QuickAction icon={<BarChart2 size={22} />}    label={t('mood_dashboard')} color="bg-accent-500/20 border-accent-500/30 text-accent-400"     onClick={onDashboard} />
            <QuickAction icon={<LifeBuoy size={22} />}     label={t('get_help')}       color="bg-red-500/15 border-red-500/30 text-red-300"                onClick={onResources} />
          </div>

          {/* About Bridge */}
          <div className="glass px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow">
                <span className="text-sm">🤝</span>
              </div>
              <div>
                <p className="text-white/80 text-sm font-semibold">About Bridge</p>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                  A first listener — not a doctor or therapist. Always routes you to real humans when it matters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column on desktop / stacked on mobile */}
        <div className="mt-5 lg:mt-0 space-y-5">
          {/* Psychoeducation carousel */}
          <div>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">Did you know?</p>
            <div className="relative overflow-hidden">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`card bg-gradient-to-br ${card.color} border border-white/10 transition-all duration-500 ${
                    i === cardIndex ? 'block animate-slide-up' : 'hidden'
                  }`}
                >
                  <p className="text-3xl mb-3">{card.emoji}</p>
                  <p className="text-white/80 text-sm lg:text-base leading-relaxed font-medium">{card.text}</p>
                </div>
              ))}
              <div className="flex gap-1.5 mt-3 justify-center">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCardIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === cardIndex ? 'bg-primary-400 w-6' : 'bg-white/20 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Crisis banner — desktop only visible here */}
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3">
            <span className="text-xl">🚨</span>
            <div className="flex-1">
              <p className="text-red-300 text-sm font-semibold">In immediate danger?</p>
              <p className="text-white/40 text-xs">Emergency: <span className="font-bold text-white/60">112</span></p>
            </div>
            <button
              onClick={onResources}
              className="text-red-300 text-xs font-semibold underline underline-offset-2"
            >
              See all helplines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border ${color} bg-white/5 active:scale-95 transition-all duration-150 text-center`}
    >
      {icon}
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </button>
  );
}
