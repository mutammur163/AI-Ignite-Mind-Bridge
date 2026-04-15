// Storage utility — all data stays on device
const KEYS = {
  USER_PROFILE: 'mb_user_profile',
  MOOD_HISTORY: 'mb_mood_history',
  ONBOARDED: 'mb_onboarded',
  STREAK: 'mb_streak',
  LAST_CHECKIN: 'mb_last_checkin',
};

export function saveUserProfile(profile) {
  localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getUserProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER_PROFILE)) || null;
  } catch {
    return null;
  }
}

export function setOnboarded(value) {
  localStorage.setItem(KEYS.ONBOARDED, JSON.stringify(value));
}

export function isOnboarded() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ONBOARDED)) === true;
  } catch {
    return false;
  }
}

export function saveMoodEntry(entry) {
  // entry: { mood: 1-5, label: string, note: string, timestamp: ISO string }
  const history = getMoodHistory(90);
  history.push({ ...entry, timestamp: entry.timestamp || new Date().toISOString() });
  localStorage.setItem(KEYS.MOOD_HISTORY, JSON.stringify(history));

  // Update streak
  const today = new Date().toDateString();
  const last = localStorage.getItem(KEYS.LAST_CHECKIN);
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let streak = parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);

  if (last === yesterday) {
    streak += 1;
  } else if (last !== today) {
    streak = 1;
  }

  localStorage.setItem(KEYS.LAST_CHECKIN, today);
  localStorage.setItem(KEYS.STREAK, String(streak));
}

export function getMoodHistory(days = 30) {
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.MOOD_HISTORY)) || [];
    if (days === 90) return raw;
    const cutoff = Date.now() - days * 86400000;
    return raw.filter(e => new Date(e.timestamp).getTime() > cutoff);
  } catch {
    return [];
  }
}

export function getStreak() {
  return parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);
}

export function checkedInToday() {
  return localStorage.getItem(KEYS.LAST_CHECKIN) === new Date().toDateString();
}

// Seed demo data for dashboard visualization
export function seedDemoData() {
  if (getMoodHistory(90).length > 0) return;

  const labels = ['Great','Good','Okay','Low','Really Struggling'];
  const weights= [5, 4, 3, 2, 1];
  const now = Date.now();
  const entries = [];

  // 30 days of data — slightly declining then recovering
  for (let i = 29; i >= 0; i--) {
    const dayOffset = i;
    // Simulate a dip around day 20–25
    let pool;
    if (dayOffset >= 20 && dayOffset <= 25) {
      pool = [2, 2, 1, 3, 2];
    } else if (dayOffset >= 10 && dayOffset <= 19) {
      pool = [3, 3, 4, 2, 3];
    } else {
      pool = [4, 5, 4, 3, 4];
    }
    const score = pool[Math.floor(Math.random() * pool.length)];
    entries.push({
      mood: score,
      label: labels[5 - score],
      note: '',
      timestamp: new Date(now - dayOffset * 86400000).toISOString(),
    });
  }

  localStorage.setItem('mb_mood_history', JSON.stringify(entries));
  localStorage.setItem('mb_streak', '5');
  localStorage.setItem('mb_last_checkin', new Date(Date.now() - 86400000).toDateString());
}
