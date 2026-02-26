<p align="center">
  <img src="Pictures/Trade_Quest.png" alt="TradeQuest Logo" width="200" />
</p>

<h1 align="center">TradeQuest</h1>

<p align="center">
  <strong>AI-Powered Finance Education & Investment Intelligence Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Finnhub-1DB954?style=for-the-badge&logoColor=white" alt="Finnhub" />
</p>

---

## 📋 Overview

**TradeQuest** is a gamified finance education platform that teaches trading, market analysis, and investment strategies through interactive scenarios. It combines **Google Gemini AI** analysis, **live financial news** (via Finnhub), and hands-on prediction games to make financial education engaging and accessible.

Players analyze real-time candlestick charts, react to breaking market news, make predictions, and receive instant AI-powered feedback — all while earning XP and leveling up.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎮 **Interactive Trading Scenarios** | 7 curated scenarios covering cybersecurity breaches, earnings reports, crypto crashes, and more |
| 🤖 **AI Game Master** | Google Gemini provides post-prediction analysis, learning takeaways, and fun facts |
| 📊 **ML Prediction Engine** | Compare your predictions against an ML model's confidence-scored analysis |
| 📰 **Live News Intelligence** | Real-time financial news from Finnhub, analyzed by Gemini for severity & market impact |
| 🏆 **Gamification** | XP points, level progression, weekly streaks, and leaderboard |
| 🏋️ **Practice Zone** | Challenge-based flashcards to hone specific trading skills |
| 🎨 **Modern UI** | Dark-themed dashboard with smooth Framer Motion animations and interactive charts |

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** — High-performance Python API framework
- **Uvicorn** — ASGI server
- **Pydantic** — Data validation & settings management
- **Google Generative AI SDK** — Gemini integration
- **Supabase Python Client** — Database & auth
- **HTTPX** — Async HTTP client (Finnhub API)

### Frontend
- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Animations & transitions
- **Lightweight Charts** — Interactive candlestick charts
- **Supabase JS** — Client-side auth & database

### Infrastructure
- **Supabase** — PostgreSQL database with Row-Level Security & Auth
- **Finnhub API** — Live financial market news

---

## 📁 Project Structure

```
GIFT/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point & CORS config
│   │   ├── config.py                  # Environment settings (Pydantic)
│   │   ├── routes/
│   │   │   ├── scenarios.py           # Scenario CRUD & prediction logic
│   │   │   ├── ai.py                  # AI explanation endpoints
│   │   │   ├── ml.py                  # ML prediction endpoints
│   │   │   ├── news.py                # Live news & SSE stream
│   │   │   └── settings.py           # User settings endpoints
│   │   ├── services/
│   │   │   ├── gemini_service.py      # Gemini AI integration
│   │   │   └── news_intelligence.py   # Finnhub news fetching & analysis
│   │   ├── models/
│   │   │   └── schemas.py             # Pydantic data models
│   │   └── data/
│   │       ├── mock_chart_data.py     # Candlestick chart data
│   │       └── settings_data.py       # User settings persistence
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Landing / home page
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── globals.css            # Global styles
│   │   │   ├── auth/                  # Authentication page
│   │   │   ├── playground/            # Main trading game
│   │   │   ├── practice-zone/         # Challenge flashcards & dynamic games
│   │   │   ├── scenarios/             # Scenario catalog
│   │   │   ├── leaderboard/           # Leaderboard page
│   │   │   ├── history/               # Prediction history
│   │   │   ├── settings/              # User settings
│   │   │   └── help/                  # Help & FAQ
│   │   ├── components/
│   │   │   ├── CandlestickChart.tsx   # Interactive trading chart
│   │   │   ├── DashboardLayout.tsx    # Main layout with sidebar
│   │   │   ├── NewsAlertPanel.tsx     # Live news alert panel (SSE)
│   │   │   ├── NewsTicker.tsx         # Animated news ticker
│   │   │   ├── PredictionButtons.tsx  # UP / DOWN prediction UI
│   │   │   ├── ResultsScreen.tsx      # Post-prediction analysis
│   │   │   └── Sidebar.tsx            # Navigation sidebar
│   │   └── lib/
│   │       ├── api.ts                 # Backend API client
│   │       ├── supabase.ts            # Supabase client init
│   │       └── SettingsContext.tsx     # Settings context provider
│   ├── public/                        # Static assets & logo
│   └── package.json
│
├── supabase/
│   └── schema.sql                     # Full database schema with RLS
│
├── Pictures/                          # Project logo assets
├── Information.md                     # Detailed project documentation
└── Readme.md                          # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- A [Supabase](https://supabase.com/) project
- A [Google Gemini API](https://ai.google.dev/) key
- A [Finnhub API](https://finnhub.io/) key (for live news)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GIFT
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```
Edit `.env` with your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
FINNHUB_API_KEY=your-finnhub-api-key
FRONTEND_URL=http://localhost:3000
```
Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Start the dev server:
```bash
npm run dev
```

### 4. Database Setup
1. Create a new project on [Supabase](https://supabase.com/)
2. Navigate to the **SQL Editor**
3. Run `supabase/schema.sql` to create tables, RLS policies, and indexes
4. Configure your environment variables with the project URL and keys

### 5. Open the App
Visit **http://localhost:3000** in your browser.

---

## 🔧 API Reference

### Scenarios — `/api/scenarios`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List all available trading scenarios |
| `GET` | `/{slug}` | Get scenario details by slug |
| `GET` | `/{slug}/chart` | Get candlestick chart data (pre & post event) |
| `POST` | `/{slug}/predict` | Submit a user prediction |

### AI — `/api/ai`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/explain` | Get Gemini-powered Game Master explanation |

### ML — `/api/ml`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Get ML model prediction with confidence score |

### News — `/api/news`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/alerts` | Get current analyzed news alerts |
| `GET` | `/stream` | SSE stream for real-time news updates |

### Settings — `/api/settings`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get current user settings |
| `PUT` | `/` | Update user settings |
| `POST` | `/reset` | Reset user progress |
| `POST` | `/delete` | Delete user account |

---

## 🎮 Game Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Choose Scenario │────▶│  Analyze 30-Day  │────▶│  Read Breaking  │
│  from Catalog    │     │  Candlestick     │     │  News Event     │
└─────────────────┘     │  Chart           │     └────────┬────────┘
                        └──────────────────┘              │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Earn XP &      │◀────│  AI Game Master  │◀────│  Predict: Will  │
│  Level Up       │     │  Explains Why    │     │  it go UP/DOWN? │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

1. **Select** a scenario from the catalog (beginner → advanced)
2. **Analyze** 30 days of historical candlestick chart data
3. **Read** the breaking news event and its details
4. **Predict** whether the asset will go UP or DOWN
5. **Watch** the 5-day post-event chart animate in real time
6. **Learn** from the AI Game Master's detailed analysis
7. **Earn** XP and track your progress

---

## 📊 Available Scenarios

| Scenario | Asset | Difficulty | XP |
|----------|-------|------------|----|
| The Zero-Day Vulnerability | CYBERFORT (CBFT) | 🟢 Beginner | 150 |
| Earnings Surprise Rally | NVIDIA (NVDA) | 🟢 Beginner | 100 |
| Tech IPO Frenzy | AI Startup (AIUP) | 🟢 Beginner | 150 |
| Interest Rate Shock | S&P 500 (SPY) | 🟡 Intermediate | 200 |
| Oil Supply Disruption | Crude Oil (CL) | 🟡 Intermediate | 250 |
| Crypto Flash Crash | Bitcoin (BTC) | 🔴 Advanced | 350 |
| Currency War | EUR/USD | 🔴 Advanced | 400 |

---

## 🤖 AI Game Master

The Gemini-powered Game Master provides rich post-prediction analysis:

- **Winner Determination** — Who predicted correctly: you, the ML model, both, or neither
- **Outcome Summary** — Dramatic 2-3 sentence recap of what happened
- **User Analysis** — Why your prediction was right or wrong
- **ML Analysis** — What patterns the algorithm detected
- **Learning Takeaway** — Key finance lesson from the scenario
- **Fun Fact** — Real-world parallel or interesting trivia

---

## 📰 News Intelligence Module

The live news system uses **Finnhub** to fetch real-time financial news and **Gemini AI** to analyze each article:

- **Real-time streaming** via Server-Sent Events (SSE)
- **AI severity analysis** — Each article is scored for market impact
- **Alert panel** — Live-updating news alerts in the dashboard
- **Animated ticker** — Scrolling news headlines across the UI

---

## 🔐 Security

- **Backend**: CORS restricted to frontend origin, Pydantic input validation, env vars for secrets
- **Database**: Supabase Row-Level Security (RLS), auth-based policies, per-user data isolation
- **Frontend**: Environment variable config, type-safe API responses, error boundary handling

---

## 📈 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with XP, level, streaks, and avatar |
| `scenarios` | Catalog of trading scenarios |
| `predictions` | User prediction history and results |
| `learning_progress` | Completed scenarios and learning takeaways |

All tables use Row-Level Security and automatic profile creation on signup.

---

## 🎓 What You'll Learn

- How markets react to breaking news events
- Technical analysis & chart reading basics
- Risk management principles
- Behavioral finance patterns
- AI vs. human prediction accuracy
- Core financial terminology

---

## 🛠️ Development

```bash
# Run backend (from /backend)
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Run frontend (from /frontend)
npm run dev

# Lint frontend
npm run lint

# Build frontend for production
npm run build
```

---

<p align="center">
  Built with ❤️ for the Hackathon
</p>
