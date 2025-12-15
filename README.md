# WavLang Frontend

An intelligent audio transcription and analysis platform powered by AI. Upload audio files, get instant transcriptions, and receive AI-powered insights including sentiment analysis, key points extraction, and more.

**WavLang URL:** [wavlang-url](https://wavlang-frontend-production.up.railway.app/)

**Backend Repository:** [wavlang-backend](https://github.com/JamieJiHeonKim/wavlang-backend)

---

## Quick Demo

### Test Credentials
- **Email:** `admin@test.com`
- **Password:** `Password1234!` *(note the uppercase P)*

### Demo Steps

1. **Login**
   - Navigate to the Login page
   - Enter the credentials above
   - Click "Sign In"

2. **Transcribe Audio**
   - Go to the **Transcribe** tab
   - Select **Sentiment Analysis** from the dropdown
   - Select **Music** as the topic
   - Upload the **"Thinking Out Loud.mp3"** file from the root directory
   - Click **Transcribe**
   - Wait for AI to process the audio and generate insights

3. **View Results**
   - See the full transcription
   - Review AI-generated sentiment analysis
   - Explore the audio waveform player

---

## Technologies Used

### Frontend Stack
- **React 18** - Modern UI framework with hooks
- **React Router 6** - Client-side routing and navigation
- **Redux + Redux Thunk** - State management
- **Axios** - HTTP client for API requests
- **Material-UI (MUI)** - Component library and UI design
- **Bootstrap 5** - Responsive layout framework
- **SASS/SCSS** - CSS preprocessing
- **WaveSurfer.js** - Audio waveform visualization
- **OpenAI API** - GPT-4 powered text analysis
- **AssemblyAI** - Advanced audio transcription

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure authentication
- **Google OAuth 2.0** - Social login integration
- **js-cookie** - Cookie management

### Form Handling & Validation
- **Formik** - Form state management
- **Yup & Zod** - Schema validation
- **React Hook Form** - Performant form validation

### Data Visualization
- **Nivo** - Beautiful charts (Bar, Line, Pie, Geo)
- **FullCalendar** - Calendar and scheduling UI
- **MUI X Data Grid** - Advanced data tables

### Development & Build Tools
- **Create React App** - Build toolchain
- **Serve** - Production static file server
- **Railway** - Cloud deployment platform
- **Nixpacks** - Build system

---

## System Architecture

### Design Rationale

This architecture was chosen to achieve **scalability**, **separation of concerns**, and **optimal performance** for an AI-powered transcription platform.

**Key Design Decisions:**

1. **Decoupled Frontend/Backend (REST API)**
   - **Why:** Separates presentation from business logic, enabling independent scaling and deployment
   - **Usage:** Frontend can be updated without touching backend; backend can serve multiple clients (web, mobile, API)

2. **Static Site Deployment (React SPA)**
   - **Why:** Faster load times via CDN, reduced server costs, better SEO with pre-rendering
   - **Usage:** Railway serves built static files globally with minimal latency

3. **Third-Party AI Services (OpenAI, AssemblyAI)**
   - **Why:** Leverages state-of-the-art models without maintaining ML infrastructure
   - **Usage:** Backend orchestrates API calls, handles retries, and caches results

4. **Redux State Management**
   - **Why:** Centralized state prevents prop drilling, enables time-travel debugging
   - **Usage:** Authentication state, transcription results, and user preferences persist across routes

5. **JWT Authentication**
   - **Why:** Stateless, scalable authentication without server-side sessions
   - **Usage:** Tokens stored client-side, validated on each API request

6. **Component-Based Architecture**
   - **Why:** Reusability, maintainability, and parallel development by team members
   - **Usage:** Atomic design system enables consistent UI and faster feature development

**Real-World Usage:**
- User uploads audio → Frontend streams to backend → Backend queues job → AssemblyAI transcribes → OpenAI analyzes → Results cached in MongoDB → Frontend polls for completion
- Handles concurrent users efficiently with async processing
- Scales horizontally on Railway as traffic increases

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │   Browser    │   │    Mobile    │   │   Desktop    │     │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────┼────────────────────────────────┐
│                    Railway CDN (Frontend)                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │              React SPA (Static Build)              │     │
│  │  • Components  • Redux Store  • Router  • Assets   │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
┌────────────────────────────┼────────────────────────────────┐
│                  Railway (Backend Server)                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Node.js + Express API                 │     │
│  │  • Authentication  • File Upload  • User Mgmt      │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐   ┌───────▼────────┐
│   MongoDB      │  │   AssemblyAI    │   │   OpenAI GPT-4 │
│   Database     │  │  Transcription  │   │    Analysis    │
│                │  │      API        │   │      API       │
└────────────────┘  └─────────────────┘   └────────────────┘
```

### Frontend Architecture

```
src/
├── api/                 # API client configuration
│   └── index.js         # Axios instance with interceptors
│
├── components/          # Reusable UI components
│   ├── AuthContext/     # Authentication state management
│   ├── Navbar/          # Navigation component
│   ├── Layout/          # Page layout wrapper
│   └── ...              # Other shared components
│
├── pages/               # Route-level components
│   ├── Home.js          # Landing page
│   ├── Login/           # Authentication pages
│   ├── Dashboard/       # User dashboard with analytics
│   ├── Transcribe/      # Audio transcription interface
│   │   ├── AudioPlayer/ # Waveform audio player
│   │   ├── AssemblyAI/  # AssemblyAI integration
│   │   ├── Whisper/     # OpenAI Whisper integration
│   │   └── Analysis/    # AI analysis results
│   └── ...
│
├── redux/               # State management
│   ├── actions/         # Action creators
│   ├── reducers/        # Redux reducers
│   └── const/           # Action type constants
│
├── sections/            # Page sections (About, Features, etc.)
└── assets/              # Images, audio samples, icons
```

### Data Flow

1. **User Authentication**
   ```
   Login Form → API Request → Backend Validation → JWT Token → Redux Store → Local Storage
   ```

2. **Audio Transcription Flow**
   ```
   File Upload → FormData → Backend API → AssemblyAI/Whisper → 
   Transcription Result → OpenAI GPT-4 Analysis → Redux State → UI Update
   ```

3. **State Management**
   ```
   User Action → Action Creator → Redux Thunk Middleware → 
   API Call → Reducer → Store Update → Component Re-render
   ```

### Key Design Patterns

- **Component Architecture:** Atomic design with reusable components
- **State Management:** Redux with thunk middleware for async operations
- **Authentication:** JWT-based with refresh token rotation
- **API Layer:** Centralized Axios instance with request/response interceptors
- **Routing:** Protected routes with authentication guards
- **Error Handling:** Global error boundaries and toast notifications
- **Code Splitting:** Lazy loading for optimal performance

---

## Installation & Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/JamieJiHeonKim/wavlang-frontend.git
cd wavlang-frontend

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
# Create a .env file with:
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_KEY=your_openai_api_key
REACT_APP_ASSEMBLY_API_KEY=your_assemblyai_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build the app
npm run build

# Serve locally
npm run serve
```

---

## Deployment (Railway)

This project is configured for seamless deployment on Railway.

### Environment Variables Required
```bash
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_API_KEY=your_openai_api_key
REACT_APP_ASSEMBLY_API_KEY=your_assemblyai_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Deploy Steps
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables in Railway dashboard
4. Railway auto-builds and deploys
5. Access your app at the generated Railway URL

---

## Features

- **Audio Transcription** - Convert speech to text with high accuracy
- **AI Analysis** - Sentiment analysis, key points, action items
- **User Dashboard** - Analytics and usage tracking
- **Audio Visualization** - Interactive waveform player
- **Secure Authentication** - JWT + Google OAuth
- **Responsive Design** - Works on all devices
- **Multi-language Support** - Transcribe in 90+ languages
- **Cloud Storage** - Secure file management

---

## License

MIT License - See LICENSE file for details

---