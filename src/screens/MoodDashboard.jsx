import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { ArrowLeft, Flame, Loader2 } from 'lucide-react';
import { getMoodHistory, getStreak } from '../utils/storage';
import { getWeeklyReflection } from '../services/claudeService';

const MOOD_COLORS = { 5: '#4CAF50', 4: '#8BC34A', 3: '#FFC107', 2: '#FF9800', 1: '#F44336' };
const MOOD_LABELS = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];
const DAY_LABELS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const SHORT_MONTHS= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(iso) {
  const d = new Date(iso);
  return `${DAY_LABELS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const v = payload[0].value;
    return (
      <div className="bg-surface-700 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80">
        <span className="font-semibold" style={{ color: MOOD_COLORS[v] }}>{MOOD_LABELS[v]}</span>
      </div>
    );
  }
  return null;
};

export default function MoodDashboard({ onBack, t, lang }) {
  const [view, setView] = useState('week');
  const [reflection, setReflection] = useState('');
  const [loadingRef, setLoadingRef] = useState(true);
  const streak       = getStreak();
  const weekHistory  = getMoodHistory(7);
  const monthHistory = getMoodHistory(30);

  const chartData = (view === 'week' ? weekHistory : monthHistory).map(e => ({
    date: formatDate(e.timestamp),
    mood: e.mood,
    fill: MOOD_COLORS[e.mood] || '#7C4DFF',
  }));

  const avgMood = monthHistory.length
    ? (monthHistory.reduce((s, e) => s + e.mood, 0) / monthHistory.length).toFixed(1)
    : 0;

  useEffect(() => {
    setLoadingRef(true);
    getWeeklyReflection(weekHistory.length ? weekHistory : [], lang)
      .then(text => setReflection(text))
      .catch(() => setReflection("This week, you showed up for yourself. That matters more than you know. 🌱"))
      .finally(() => setLoadingRef(false));
  }, [lang]);

  const moodCounts = [5, 4, 3, 2, 1].map(score => ({
    score,
    label: MOOD_LABELS[score],
    count: monthHistory.filter(e => e.mood === score).length,
    color: MOOD_COLORS[score],
  }));
  const maxCount = Math.max(...moodCounts.map(m => m.count), 1);

  return (
    <div className="min-h-dvh lg:min-h-0 flex flex-col bg-surface-900 pb-20 lg:pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 lg:px-8 pt-10 lg:pt-8 pb-4 bg-surface-800 border-b border-white/5">
        <button onClick={onBack} className="lg:hidden p-2 -ml-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg lg:text-xl font-extrabold text-white">{t('dashboard_title')}</h1>
      </div>

      <div className="flex-1 px-5 lg:px-8 py-5 lg:py-8 overflow-y-auto">
        {/* Desktop two-column grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">

          {/* Left column */}
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard emoji="🔥" value={streak}         label={t('streak_label')}     color="from-orange-600/30 to-orange-500/10"  border="border-orange-500/30" />
              <StatCard emoji="📊" value={`${avgMood}/5`} label="Avg Mood"              color="from-primary-600/30 to-primary-500/10" border="border-primary-500/30" />
              <StatCard emoji="📅" value={monthHistory.length} label="Check-ins"        color="from-accent-600/30 to-accent-500/10"   border="border-accent-500/30" />
            </div>

            {/* View toggle */}
            <div className="flex bg-surface-800 rounded-2xl p-1 gap-1">
              {[{ id: 'week', label: t('week_view') }, { id: 'month', label: t('month_view') }].map(v => (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${view === v.id ? 'bg-primary-500 text-white shadow-glow' : 'text-white/40 hover:text-white/70'}`}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="card">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">
                {view === 'week' ? 'Mood — Last 7 Days' : 'Mood — Last 30 Days'}
              </p>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm text-center">{t('no_data')}</div>
              ) : view === 'week' ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={28} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={d => d.split(' ')[0]} />
                    <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,77,255,0.1)', radius: 8 }} />
                    <Bar dataKey="mood" radius={[8,8,0,0]} fill="#7C4DFF"
                      label={false}
                    >
                      {chartData.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 5)} tickFormatter={d => d.split(' ')[1]} />
                    <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="mood" stroke="#7C4DFF" strokeWidth={2.5} dot={{ fill: '#7C4DFF', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#00BCD4' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5 mt-5 lg:mt-0">
            {/* Mood distribution */}
            <div className="card">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Mood Distribution (30 days)</p>
              <div className="space-y-2.5">
                {moodCounts.map(m => (
                  <div key={m.score} className="flex items-center gap-3">
                    <span className="text-white/40 text-xs w-20 flex-shrink-0">{m.label}</span>
                    <div className="flex-1 bg-surface-700 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(m.count / maxCount) * 100}%`, backgroundColor: m.color }} />
                    </div>
                    <span className="text-white/30 text-xs w-4 text-right">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly reflection */}
            <div className="card border border-primary-500/20 bg-primary-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <span className="text-xs">🤝</span>
                </div>
                <p className="text-primary-300 text-xs font-semibold uppercase tracking-wide">{t('your_week')}</p>
              </div>
              {loadingRef ? (
                <div className="flex items-center gap-2 text-white/30">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">{t('generating')}</span>
                </div>
              ) : (
                <p className="text-white/80 text-sm leading-relaxed italic">"{reflection}"</p>
              )}
            </div>

            {/* Motivational tip */}
            <div className="card bg-gradient-to-br from-accent-600/20 to-accent-500/5 border border-accent-500/20">
              <p className="text-accent-300 text-xs font-semibold uppercase tracking-wide mb-2">💡 Tip</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Checking in daily — even for 60 seconds — helps Bridge spot patterns before they become crises.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label, color, border }) {
  return (
    <div className={`card bg-gradient-to-br ${color} border ${border} text-center p-3 lg:p-4`}>
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-white font-extrabold text-lg leading-none">{value}</p>
      <p className="text-white/40 text-xs mt-1.5 leading-tight">{label}</p>
    </div>
  );
}
