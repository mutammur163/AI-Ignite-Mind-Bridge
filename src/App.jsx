import { useState, useEffect, useCallback } from 'react';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MoodDashboard from './screens/MoodDashboard';
import ResourcesScreen from './screens/ResourcesScreen';
import CheckInModal from './components/CheckInModal';
import CrisisModal from './components/CrisisModal';
import { useLanguage } from './hooks/useLanguage';
import {
  saveUserProfile,
  getUserProfile,
  isOnboarded,
  setOnboarded,
  seedDemoData,
} from './utils/storage';

const SCREEN = {
  SPLASH: 'splash',
  ONBOARDING: 'onboarding',
  HOME: 'home',
  CHAT: 'chat',
  DASHBOARD: 'dashboard',
  RESOURCES: 'resources',
};

// Desktop sidebar navigation items
const NAV_ITEMS = [
  { id: SCREEN.HOME,      emoji: '🏠', labelKey: 'home' },
  { id: SCREEN.CHAT,      emoji: '💬', labelKey: 'chat' },
  { id: SCREEN.DASHBOARD, emoji: '📊', labelKey: 'dashboard' },
  { id: SCREEN.RESOURCES, emoji: '🆘', labelKey: 'resources' },
];

export default function App() {
  const [screen, setScreen]         = useState(SCREEN.SPLASH);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCrisis,  setShowCrisis]  = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [lastMood,    setLastMood]    = useState(null);

  const { lang, setLang, t } = useLanguage(
    userProfile?.language || 'English'
  );

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUserProfile(profile);
      setLang(profile.language || 'English');
    }
    seedDemoData();
  }, []);

  const handleSplashDone = useCallback(() => {
    setScreen(isOnboarded() ? SCREEN.HOME : SCREEN.ONBOARDING);
  }, []);

  const handleOnboardingComplete = useCallback((data) => {
    const profile = {
      name: data.name || 'friend',
      ageGroup: data.ageGroup,
      language: data.language,
      initialFeeling: data.initialFeeling,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(profile);
    setOnboarded(true);
    setUserProfile(profile);
    setLang(profile.language);
    setScreen(SCREEN.HOME);
  }, [setLang]);

  const handleCheckInComplete = useCallback((mood) => {
    setLastMood(mood);
    setShowCheckIn(false);
  }, []);

  const isFullscreen = screen === SCREEN.SPLASH || screen === SCREEN.ONBOARDING;
  const showNav = !isFullscreen;

  return (
    <div className="min-h-dvh bg-surface-900 flex">
      {/* ───────────────────────────── DESKTOP SIDEBAR ───────────────────────────── */}
      {showNav && (
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-surface-800 border-r border-white/5 sticky top-0 h-screen">
          {/* Brand */}
          <div className="px-6 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white leading-none">
                  <span className="text-gradient">Mind</span>Bridge
                </h1>
                <p className="text-white/30 text-xs mt-0.5">Wellness Companion</p>
              </div>
            </div>

            {/* User pill */}
            {userProfile && (
              <div className="mt-5 flex items-center gap-3 bg-surface-700 rounded-2xl px-3 py-2.5 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-primary-500/30 flex items-center justify-center text-base">
                  {userProfile.name?.[0]?.toUpperCase() || '👤'}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{userProfile.name}</p>
                  <p className="text-white/30 text-xs">{userProfile.ageGroup} · {userProfile.language}</p>
                </div>
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {NAV_ITEMS.map(item => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                    active
                      ? 'bg-primary-500/20 border border-primary-500/40 text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <span className="font-semibold text-sm">{t(item.labelKey)}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Check-in CTA in sidebar */}
          <div className="px-4 pb-6">
            <button
              onClick={() => setShowCheckIn(true)}
              className="w-full btn-primary text-sm py-3"
            >
              ✨ Daily Check-in
            </button>
            <p className="text-white/15 text-xs text-center mt-3">
              🔒 Your data stays on this device
            </p>
          </div>
        </aside>
      )}

      {/* ───────────────────────────── MAIN CONTENT ───────────────────────────── */}
      <main className={`flex-1 min-w-0 flex flex-col ${isFullscreen ? '' : 'lg:overflow-y-auto'}`}>
        {/* Fullscreen screens (splash, onboarding) */}
        {screen === SCREEN.SPLASH && (
          <SplashScreen onDone={handleSplashDone} />
        )}
        {screen === SCREEN.ONBOARDING && (
          <OnboardingScreen onComplete={handleOnboardingComplete} t={t} />
        )}

        {/* App screens — wrapped for desktop max-width centering */}
        {showNav && (
          <div className="flex-1 flex flex-col lg:items-start">
            <div className={`w-full lg:max-w-2xl xl:max-w-3xl ${screen === SCREEN.CHAT ? '' : 'lg:pb-8'}`}>
              {screen === SCREEN.HOME && (
                <HomeScreen
                  userName={userProfile?.name}
                  lang={lang}
                  t={t}
                  lastMood={lastMood}
                  onCheckIn={() => setShowCheckIn(true)}
                  onChat={() => setScreen(SCREEN.CHAT)}
                  onDashboard={() => setScreen(SCREEN.DASHBOARD)}
                  onResources={() => setScreen(SCREEN.RESOURCES)}
                />
              )}
              {screen === SCREEN.CHAT && (
                <ChatScreen
                  onBack={() => setScreen(SCREEN.HOME)}
                  t={t}
                  lang={lang}
                  userName={userProfile?.name}
                />
              )}
              {screen === SCREEN.DASHBOARD && (
                <MoodDashboard
                  onBack={() => setScreen(SCREEN.HOME)}
                  t={t}
                  lang={lang}
                />
              )}
              {screen === SCREEN.RESOURCES && (
                <ResourcesScreen
                  onBack={() => setScreen(SCREEN.HOME)}
                  t={t}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* ───────────────────────────── MOBILE BOTTOM NAV ───────────────────────────── */}
      {showNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-800/95 backdrop-blur-md border-t border-white/5 flex z-40 safe-bottom">
          {NAV_ITEMS.map(item => {
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                  active ? 'text-primary-400' : 'text-white/30 hover:text-white/50'
                }`}
              >
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className={`text-xs font-semibold ${active ? 'text-primary-300' : ''}`}>
                  {t(item.labelKey)}
                </span>
                {active && (
                  <div className="w-6 h-0.5 bg-primary-500 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* ───────────────────────────── MODALS ───────────────────────────── */}
      {showCheckIn && (
        <CheckInModal
          onClose={() => setShowCheckIn(false)}
          onComplete={handleCheckInComplete}
          onCrisis={() => { setShowCheckIn(false); setShowCrisis(true); }}
          t={t}
          lang={lang}
        />
      )}
      {showCrisis && (
        <CrisisModal onClose={() => setShowCrisis(false)} t={t} />
      )}
    </div>
  );
}
