# 🧠 MindBridge — AI-Powered Mental Health First Responder for India's Youth

<div align="center">

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet-FF6B35?style=flat-square)](https://anthropic.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Built for AI Ignite Hackathon 2026 · Theme: AI for Impact — Solving Everyday Challenges**

*Because the hardest step is the first one.*

</div>

---

## 🚨 The Problem

India is in the middle of a **silent mental health emergency**:

- **197 million Indians** — roughly 1 in 7 — live with some form of mental disorder *(The Lancet)*
- **20–25% of Indian youth** suffer from depression, anxiety, or substance abuse
- The treatment gap is **80.4%** — over 4 in 5 people who need care receive none
- India has only **1 psychiatrist per 100,000+ people** in most states
- **Stigma** is the #1 barrier — most students won't tell a parent, teacher, or doctor

A student in Bengaluru, Bhopal, or a tier-3 town wakes up anxious and overwhelmed — with **no one safe to talk to**. MindBridge changes that.

---

## ✨ The Solution

**MindBridge** is a culturally-aware, AI-powered mental wellness companion that acts as the **first layer of support** between a struggling young person and the professional help they need.

### Core Features

| Feature | Description |
|---|---|
| 🗓️ **Daily Check-in** | 5-mood emoji tiles + optional note + instant AI response |
| 💬 **Talk to Bridge** | Full conversational AI — empathetic, non-diagnostic, always available |
| 📊 **Mood Dashboard** | 7-day bar chart + 30-day trend line + AI-generated weekly reflection |
| 🚨 **Crisis Detection** | NLP-based phrase detection → instant escalation modal with real helplines |
| 🆘 **Resource Routing** | iCall, Vandrevala Foundation, Tele MANAS, iCall Chat — one tap away |
| 🌐 **Multilingual** | English + Hindi support throughout the entire app |
| 🔒 **Privacy-First** | No backend, no account — all data stays on your device |

---

## 🖥️ Screenshots

> **Fully responsive** — desktop sidebar navigation + mobile bottom navigation

| Splash | Onboarding | Home (Mobile) |
|--------|-----------|---------------|
| Animated logo + ambient orbs | 4-step warm onboarding | Check-in CTA + quick actions |

| Home (Desktop) | Mood Dashboard | Resources |
|----------------|----------------|-----------|
| Sidebar nav + 2-column layout | Charts + AI reflection | Helpline cards with filters |

| Chat with Bridge | Crisis Modal | Check-in Modal |
|-----------------|-------------|----------------|
| Conversation UI | Calm escalation screen | Bottom sheet / center dialog |

---

## 🛠️ Tech Stack

```
Frontend        React 18 + Vite 5
Styling         Tailwind CSS v3 (custom design system)
AI              Claude (via Anthropic API) — claude-sonnet-4-5
Charts          Recharts
Icons           Lucide React
Fonts           Plus Jakarta Sans (Google Fonts)
Storage         localStorage (no backend)
Deployment      Vercel
```

---

## 📁 Project Structure

```
src/
├── screens/
│   ├── SplashScreen.jsx        # Animated logo, auto-advance
│   ├── OnboardingScreen.jsx    # 4-step flow (name → age → language → feeling)
│   ├── HomeScreen.jsx          # Dashboard hub (responsive 2-col on desktop)
│   ├── ChatScreen.jsx          # Full AI conversation with Bridge
│   ├── MoodDashboard.jsx       # Charts + stats + AI weekly reflection
│   └── ResourcesScreen.jsx     # Helpline cards with filter chips
├── components/
│   ├── CheckInModal.jsx        # Bottom sheet (mobile) / dialog (desktop)
│   └── CrisisModal.jsx         # Crisis escalation with calm design
├── services/
│   └── claudeService.js        # All Claude API calls + demo mode fallbacks
├── hooks/
│   └── useLanguage.js          # English/Hindi i18n hook
├── utils/
│   └── storage.js              # localStorage helpers + demo data seeder
├── data/
│   └── resources.json          # Helpline static data
└── App.jsx                     # Root — screen state machine + responsive layout
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) An [Anthropic API key](https://console.anthropic.com/) for real AI responses

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mutammur163/AI-Ignite-Mind-Bridge.git
cd AI-Ignite-Mind-Bridge

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional — app works in demo mode without this)
copy .env.example .env
# Open .env and add your Anthropic API key:
# VITE_ANTHROPIC_API_KEY=your_key_here

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Available Commands

```bash
npm run dev       # Start development server (hot reload)
npm run build     # Build for production (output → dist/)
npm run preview   # Preview production build locally
```

---

## 🤖 AI / Demo Mode

MindBridge works **without an API key** in demo mode:

- Check-in responses → curated empathetic responses
- Chat replies → context-aware demo messages (exam stress, loneliness, anxiety)
- Weekly reflection → warm pre-written reflection

To enable real Claude AI responses, add your key to `.env`:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

The Claude system prompts are carefully tuned to:
- Be warm, validating, non-diagnostic
- Never give medical advice
- Always offer human escalation paths
- Respect Indian cultural context

---

## 📱 Responsive Design

| Viewport | Layout |
|---|---|
| **Mobile** (< 1024px) | Full-screen screens, bottom navigation bar, bottom-sheet modals |
| **Desktop** (≥ 1024px) | Fixed sidebar with brand + user profile + nav links, 2-column content grids, centered dialog modals |

---

## 🆘 Crisis Safety

Crisis detection happens **client-side first** (no API call needed):

- Scans for 20+ high-risk phrases (hopelessness, self-harm, suicidal ideation)
- Immediately surfaces the Crisis Modal with real, verified helplines:
  - **iCall** (TISS) — `9152987821` | Mon–Sat 8 AM–10 PM | Free
  - **Vandrevala Foundation** — `1860-2662-345` | 24/7 | Free
  - **Tele MANAS** (Govt. of India) — `14416` | 24/7 | Free
  - **iCall Online Chat** — [icallhelpline.org](https://icallhelpline.org)
- Bridge **never dismisses distress** — always routes to real humans

> ⚠️ MindBridge is a **support companion**, not a medical tool. It does not diagnose. Always consult a qualified mental health professional for diagnosis or treatment.

---

## 🌐 Deployment (Vercel)

```bash
# Build the project
npm run build

# Option A: Drag the dist/ folder to vercel.com
# Option B: Connect your GitHub repo on vercel.com (auto-deploys on push)
```

A `vercel.json` is included for proper SPA routing.

---

## 📊 Success Metrics (Post-Hackathon Targets)

| Metric | Target (6 months) |
|---|---|
| Daily Active Users | 50,000 |
| Check-in completion rate | >70% |
| Crisis escalations handled | >95% connected to a human |
| Avg. session duration | 4–6 min |
| Mood improvement (self-reported) | +25% over 8 weeks |
| Retention (Day 30) | >40% |

---

## 🗺️ Roadmap

| Phase | Features |
|---|---|
| v1.1 | Push notifications, streak gamification, Tamil/Telugu/Kannada |
| v1.2 | School counselor dashboard, cohort risk monitoring |
| v2.0 | Peer support circles with AI moderation |
| v2.1 | Tele MANAS API integration |
| v3.0 | Wearable data integration (sleep, HRV) for passive mood sensing |

---

## ⚖️ Ethical Commitments

- ❌ MindBridge **never** claims to be a diagnostic tool
- 🔒 No user data is ever sold or uploaded
- 🤝 Crisis escalation to a human is always one tap away
- 📋 Compliant with India's **Mental Healthcare Act, 2017**
- 📖 AI responses reviewed against WHO safe messaging guidelines

---

## 👥 Team

**AI Ignite Hackathon 2026** · Theme: AI for Impact

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**MindBridge — Because the hardest step is the first one.**

*197 million Indians live with mental illness. 80% get no help. We built the bridge.*

</div>
