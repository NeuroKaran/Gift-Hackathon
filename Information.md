# TradeQuest - AI-Powered Finance Education & Investment Intelligence Platform

## 📋 Project Overview

**TradeQuest** is a gamified finance education platform that helps users learn about trading, market analysis, and investment strategies through interactive scenarios. The platform combines AI-powered analysis with hands-on prediction games to make financial education engaging and accessible.

## 🎯 Key Features

### 1. **Interactive Trading Scenarios**
- 7 different trading scenarios covering various market events
- Real-world inspired events (cybersecurity breaches, earnings reports, interest rate changes, etc.)
- Difficulty levels: beginner, intermediate, advanced
- XP rewards system for learning progression

### 2. **AI Game Master (Gemini-Powered)**
- Google Gemini AI provides intelligent post-prediction analysis
- Explains market outcomes and learning takeaways
- Compares user predictions vs ML model predictions
- Educational insights and fun facts

### 3. **ML Prediction Engine**
- Mock ML model that predicts market movements
- Confidence scores and reasoning explanations
- Compares human intuition vs algorithmic analysis

### 4. **Gamification System**
- XP points and level progression
- Weekly streaks and achievements
- Leaderboard potential
- User profiles and settings

### 5. **Technical Architecture**
- **Backend**: FastAPI (Python) with Pydantic models
- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **AI Integration**: Google Gemini API
- **Charting**: Lightweight Charts library

## 🏗️ Technical Stack

### Backend
```
- FastAPI 0.1.0
- Uvicorn (ASGI server)
- Pydantic & Pydantic Settings
- Google Generative AI SDK
- Supabase Python client
- Python 3.12+
```

### Frontend
```
- Next.js 16.1.6
- React 19.2.3
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lightweight Charts (trading charts)
```

### Database
```
- Supabase PostgreSQL
- Row-Level Security (RLS)
- Auth integration
- Real-time capabilities
```

### DevOps & Tooling
```
- Git for version control
- Environment variables (.env files)
- ESLint for code quality
- npm/yarn for package management
```

## 📁 Project Structure

```
GIFT/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Configuration management
│   │   ├── routes/              # API endpoints
│   │   │   ├── scenarios.py     # Scenario management
│   │   │   ├── ai.py            # AI explanation endpoints
│   │   │   ├── ml.py            # ML prediction endpoints
│   │   │   └── settings.py      # User settings
│   │   ├── services/           # Business logic
│   │   │   └── gemini_service.py # Gemini AI integration
│   │   ├── models/              # Data models
│   │   │   └── schemas.py       # Pydantic schemas
│   │   ├── data/                # Data access
│   │   │   ├── mock_chart_data.py # Mock chart data
│   │   │   ├── settings_data.py  # User settings persistence
│   │   │   └── user_settings.json # Default settings
│   ├── venv/                   # Python virtual environment
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   │   ├── page.tsx         # Main game page
│   │   │   └── (other routes)   # Settings, help, etc.
│   │   ├── components/         # React components
│   │   │   ├── CandlestickChart.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── NewsTicker.tsx
│   │   │   ├── PredictionButtons.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── lib/                 # Utility functions
│   │   │   └── api.ts           # API client
│   │   └── styles/              # CSS files
│   ├── public/                 # Static assets
│   ├── package.json            # Node.js dependencies
│   └── .env.local.example      # Frontend environment variables
│
├── supabase/
│   └── schema.sql              # Database schema
│
├── Pictures/                  # Project images/logos
└── Readme.md                   # Original project readme
```

## 🔧 API Endpoints

### Scenarios API (`/api/scenarios`)
- `GET /` - List all available scenarios
- `GET /{slug}` - Get single scenario details
- `GET /{slug}/chart` - Get chart data (pre/post event)
- `POST /{slug}/predict` - Submit user prediction

### AI API (`/api/ai`)
- `POST /explain` - Get AI Game Master explanation

### ML API (`/api/ml`)
- `POST /predict` - Get ML prediction for scenario

### Settings API (`/api/settings`)
- `GET /` - Get current user settings
- `PUT /` - Update user settings
- `POST /reset` - Reset user progress
- `POST /delete` - Delete user account

## 📊 Available Scenarios

| Slug | Title | Asset | Difficulty | Actual Outcome | XP Reward |
|------|-------|-------|------------|----------------|-----------|
| `zero-day-vulnerability` | The Zero-Day Vulnerability | CYBERFORT (CBFT) | beginner | DOWN | 150 |
| `earnings-surprise-rally` | Earnings Surprise Rally | NVIDIA (NVDA) | beginner | UP | 100 |
| `interest-rate-shock` | Interest Rate Shock | S&P 500 (SPY) | intermediate | DOWN | 200 |
| `crypto-flash-crash` | Crypto Flash Crash | Bitcoin (BTC) | advanced | DOWN | 350 |
| `oil-supply-disruption` | Oil Supply Disruption | Crude Oil (CL) | intermediate | UP | 250 |
| `tech-ipo-frenzy` | Tech IPO Frenzy | AI Startup (AIUP) | beginner | DOWN | 150 |
| `currency-war` | Currency War | EUR/USD | advanced | DOWN | 400 |

## 🎮 Game Flow

1. **Scenario Selection**: User chooses a trading scenario
2. **Chart Analysis**: 30-day historical chart is displayed
3. **News Event**: Breaking news headline and details shown
4. **Prediction**: User predicts if asset will go UP or DOWN
5. **Reveal**: 5-day post-event chart is animated
6. **Results**: AI Game Master provides analysis and explanation
7. **XP Reward**: User earns XP based on prediction accuracy
8. **Learning**: Key takeaways and fun facts displayed

## 🤖 AI Game Master Features

The Gemini-powered Game Master provides:
- **Winner Determination**: Who predicted correctly (user, ML, both, neither)
- **Outcome Summary**: 2-3 sentence dramatic summary
- **User Analysis**: Why the user's prediction was right/wrong
- **ML Analysis**: What patterns the AI model used
- **Learning Takeaway**: Key finance lesson
- **Fun Fact**: Real-world parallel or interesting fact

## 📈 Chart Data Structure

Each scenario has 35 candlestick bars:
- **Days 0-29**: 30 bars shown before prediction (historical data)
- **Days 30-34**: 5 bars revealed after prediction (post-event data)

Each bar contains:
- `time`: UNIX timestamp
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `close`: Closing price

## 🎨 Frontend Components

### Main Components
- **DashboardLayout**: Main game layout with sidebar
- **CandlestickChart**: Interactive trading chart
- **NewsTicker**: Animated news headline display
- **PredictionButtons**: UP/DOWN prediction buttons
- **ResultsScreen**: Post-prediction analysis display
- **Sidebar**: Navigation and user info

### UI Features
- Framer Motion animations
- Responsive design
- Dark/light theme support
- Interactive charts with zoom/pan
- Real-time updates

## 🔐 Authentication & Security

### Backend Security
- CORS restricted to frontend URL
- Environment variables for sensitive keys
- Pydantic validation for all inputs
- HTTP error handling

### Database Security
- Supabase Row-Level Security (RLS)
- Auth policies for data access
- User-specific data isolation
- Automatic profile creation on signup

### Frontend Security
- API URL configuration via environment variables
- Error handling for API failures
- Type-safe API responses

## 🚀 Setup & Installation

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Database Setup
1. Create Supabase project
2. Run `supabase/schema.sql` in Supabase SQL Editor
3. Configure environment variables

## 📱 Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 Configuration Options

### User Settings
- Name, email, notifications
- Sound effects toggle
- Difficulty level
- XP and level progression

### Game Settings
- Scenario difficulty filtering
- Chart display options
- Animation speeds
- XP multipliers

## 📊 Database Schema

### Tables
1. **profiles**: User profiles with gamification data
2. **scenarios**: Catalog of trading scenarios
3. **predictions**: User prediction history
4. **learning_progress**: Completed scenarios and takeaways

### Key Features
- Automatic profile creation on auth
- Row-level security policies
- Relationships between tables
- Indexes for performance

## 🎓 Learning Objectives

TradeQuest teaches users about:
- Market reaction to news events
- Technical analysis basics
- Risk management
- Behavioral finance
- AI vs human prediction
- Financial terminology

## 💡 Unique Features

1. **AI vs Human Competition**: Users compete against ML models
2. **Educational Gamification**: Learn while playing
3. **Real-world Parallels**: Connects game scenarios to actual events
4. **Progressive Difficulty**: From beginner to advanced scenarios
5. **Instant Feedback**: AI explanations for every prediction

## 📈 Future Enhancements

Potential features for future development:
- Multiplayer leaderboards
- Custom scenario creation
- Real market data integration
- Advanced charting tools
- Mobile app version
- Social sharing features
- Achievement system
- Tutorial mode

## 📝 Notes

- The project uses mock data for ML predictions
- Gemini AI requires API key for full functionality
- Supabase provides free tier for development
- Frontend uses Next.js App Router
- Backend follows FastAPI best practices

## 🎯 Project Goals

1. Make finance education accessible and fun
2. Teach market analysis through hands-on experience
3. Compare human intuition vs algorithmic prediction
4. Build confidence in financial decision making
5. Provide instant feedback and learning opportunities

## 🏆 Achievement System (Planned)

- Streak rewards for daily play
- Badges for completing scenario types
- Level milestones with titles
- Leaderboard rankings
- Special achievements for perfect predictions

## 🔗 Dependencies

### Production Dependencies
- FastAPI, Uvicorn, Pydantic
- Google Generative AI
- Supabase client
- Next.js, React, TypeScript
- Tailwind CSS, Framer Motion
- Lightweight Charts

### Development Dependencies
- ESLint, TypeScript
- Python virtual environment
- Node.js package manager

## 📁 File Highlights

### Key Backend Files
- `backend/app/main.py`: FastAPI application setup
- `backend/app/services/gemini_service.py`: AI integration
- `backend/app/data/mock_chart_data.py`: Chart data generation
- `backend/app/routes/scenarios.py`: Main game logic

### Key Frontend Files
- `frontend/src/app/page.tsx`: Main game page
- `frontend/src/lib/api.ts`: API client
- `frontend/src/components/CandlestickChart.tsx`: Chart component
- `frontend/src/components/ResultsScreen.tsx`: Results display

## 🎨 Design Philosophy

- **Engaging**: Game-like interface with animations
- **Educational**: Clear learning objectives and takeaways
- **Accessible**: Simple UI for finance beginners
- **Responsive**: Works on desktop and mobile
- **Performance**: Optimized for smooth animations

## 📊 Analytics (Planned)

- User prediction accuracy tracking
- Scenario completion rates
- Learning progression analytics
- Time spent per scenario
- Feature usage statistics

## 🤝 Community & Support

- Open source project
- Contribution guidelines needed
- Issue tracking system
- Documentation improvements
- Community scenarios

## 📋 License

The project appears to be proprietary but could benefit from an open-source license for community contributions.

## 🚀 Getting Started

1. Clone the repository
2. Set up backend and frontend as described
3. Run both servers
4. Open `http://localhost:3000` in browser
5. Start playing and learning!

## 📝 Summary

TradeQuest is an innovative finance education platform that combines gamification, AI analysis, and hands-on learning to make market analysis accessible to everyone. With its interactive scenarios, intelligent feedback system, and engaging gameplay, it provides a unique way to learn about trading and investment strategies.

---

**Last Updated**: 2024
**Version**: 0.1.0
**Status**: Active Development