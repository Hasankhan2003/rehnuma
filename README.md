<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/Groq_AI-LLaMA_3.3_70B-F55036?style=for-the-badge" alt="Groq AI"/>
  <img src="https://img.shields.io/badge/Manim-CE-58B4D6?style=for-the-badge" alt="Manim"/>
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/gTTS-Voice_Narration-34A853?style=for-the-badge" alt="gTTS"/>
  <img src="https://img.shields.io/badge/Quiz_Engine-MCQ_Generation-6366f1?style=for-the-badge" alt="Quiz Engine"/>
  <img src="https://img.shields.io/badge/Dashboard-Performance_Analytics-10b981?style=for-the-badge" alt="Dashboard"/>
</p>

<h1 align="center">🎓 Rehnuma</h1>

<p align="center">
  <strong>AI-Powered Probability &amp; Statistics Tutor with User Authentication</strong>
</p>

<p align="center">
  <em>رہنما (Urdu: "The Guide") — Your intelligent companion for mastering probability and statistics</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-authentication-system">Auth System</a> •
  <a href="#-quiz--dashboard">Quiz & Dashboard</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 About

**Rehnuma** is an AI-powered educational platform that transforms complex probability and statistics problems into understandable solutions with beautiful mathematical animations and synchronized voice narration. Built as a Final Year Project, it combines:

- 🔐 **JWT Authentication** — Secure signup/login with PostgreSQL and bcrypt password hashing
- 🤖 **Groq AI** (qwen/qwen3-32b) for generating detailed, step-by-step mathematical explanations
- 🎬 **Groq AI** (llama-3.3-70b-versatile) + **Manim** for creating professional visualization videos
- 🔊 **gTTS + pydub** for synchronized tutorial-style voice narration extracted from animation captions
- 🔍 **ChromaDB with RAG** for intelligent context retrieval from curated problem databases
- 🧠 **AI Quiz Engine** — Auto-generates 5 MCQs per topic using Groq, with per-question explanations
- 📊 **Performance Dashboard** — Tracks quiz attempts, scores, and analytics per user in PostgreSQL

Whether you're a student struggling with Bayes' theorem or need to visualize the Central Limit Theorem, Rehnuma provides the explanation, the visual, the voice-over, and a knowledge quiz — all in one.

---

## ✨ Features

| Feature                        | Description                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------- |
| 🔐 **User Authentication**     | Secure signup/login with PostgreSQL, bcrypt hashing, and JWT tokens              |
| 🧮 **AI Solutions**            | Detailed step-by-step explanations powered by Groq (qwen3-32b)                  |
| 🎥 **Animated Visualizations** | Auto-generated Manim animations via Groq (llama-3.3-70b-versatile)              |
| 🔊 **Voice Narration**         | Synchronized tutorial audio extracted from on-screen captions, paced with gTTS  |
| 🧠 **Knowledge Quiz**          | AI-generated 5-question MCQ quiz per topic with explanations and instant scoring |
| 📊 **Performance Dashboard**   | Per-user quiz history, average score, best score, and attempt analytics          |
| ⚡ **Smart Caching**           | 60-min solution cache, 120-min animation cache, quiz cache for performance       |
| 🔄 **Auto-Retry System**       | Self-healing Manim code generation with up to 3 automatic fix attempts           |
| 🎨 **Modern UI**               | Dark/Light theme support with responsive design                                  |
| 📚 **Curated Database**        | 100+ probability/statistics problems with expert solutions                       |

---

## 🛠 Tech Stack

### Frontend

| Technology                                    | Version | Purpose                         |
| --------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.0.7  | React framework with App Router |
| [React](https://react.dev/)                   | 19.2.0  | UI library                      |
| [TypeScript](https://www.typescriptlang.org/) | ^5.0    | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)      | ^4.1.9  | Utility-first styling           |
| [shadcn/ui](https://ui.shadcn.com/)           | Latest  | UI component library            |
| [Radix UI](https://www.radix-ui.com/)         | Various | Accessible primitives           |

### Authentication

| Technology                                          | Version  | Purpose                              |
| --------------------------------------------------- | -------- | ------------------------------------ |
| [PostgreSQL](https://www.postgresql.org/)           | 15+      | User database                        |
| [pg](https://node-postgres.com/)                    | Latest   | PostgreSQL Node.js client            |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)    | Latest   | Password hashing (12 salt rounds)    |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | Latest | JWT signing & verification    |

### Backend / AI

| Technology                                          | Version               | Purpose                                   |
| --------------------------------------------------- | --------------------- | ----------------------------------------- |
| [Groq SDK](https://console.groq.com/)               | Latest                | LLM API client (ultra-fast inference)     |
| qwen/qwen3-32b (via Groq)                           | Latest                | Solution generation                       |
| llama-3.3-70b-versatile (via Groq)                  | Latest                | Manim animation code generation & fixing  |
| [Manim Community](https://www.manim.community/)     | >=0.18.0              | Mathematical animations                   |
| [gTTS](https://pypi.org/project/gTTS/)              | >=2.5.0               | Text-to-speech tutorial narration         |
| [moviepy](https://zulko.github.io/moviepy/)         | >=1.0.3               | Audio/video merging                       |
| [pydub](https://github.com/jiaaro/pydub)            | >=0.25.1              | Audio pacing and silence insertion        |
| [ChromaDB](https://www.trychroma.com/)              | ^0.4.0                | Vector database for RAG                   |
| [LangChain](https://www.langchain.com/)             | ^0.1.0                | Document processing & embeddings          |

### Runtime

| Technology                        | Version | Purpose            |
| --------------------------------- | ------- | ------------------ |
| [Node.js](https://nodejs.org/)    | 18+     | JavaScript runtime |
| [Python](https://www.python.org/) | 3.8+    | Manim & narration  |
| [pnpm](https://pnpm.io/)          | Latest  | Package manager    |

---

## 💻 Hardware Requirements

### Minimum Requirements

| Component   | Specification              |
| ----------- | -------------------------- |
| **CPU**     | 4 cores                    |
| **RAM**     | 8 GB                       |
| **Storage** | 10 GB free space           |
| **Network** | Stable internet connection |

### Recommended for Development

| Component   | Specification                |
| ----------- | ---------------------------- |
| **CPU**     | 8+ cores                     |
| **RAM**     | 16 GB                        |
| **Storage** | SSD with 50+ GB free         |
| **GPU**     | Not required (CPU rendering) |

> **Note:** Animation rendering is CPU-intensive. Expect 50-120 seconds per animation on recommended hardware.

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **pnpm** package manager
- **Git** ([Download](https://git-scm.com/))

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version      # Should be 18+
python --version    # Should be 3.8+
pnpm --version      # Should be 8+
psql --version      # Should be 15+
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/fasih-iqbal/Rehnuma-beta.git
cd Rehnuma-beta
```

### Step 2: Install Python Dependencies

```bash
# Install Manim, narration tools, and other Python dependencies
pip install -r requirements.txt

# Verify Manim installation
manim --version
```

### Step 3: Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL (use your credentials)
psql -U postgres

# Inside psql, create the project database
CREATE DATABASE rehnuma_db;
\q
```

> **Note:** The `users` table is **created automatically** the first time someone hits a signup or login endpoint — no manual SQL needed.

### Step 4: Install Frontend Dependencies

```bash
cd Frontend
pnpm install
# or: npm install
```

### Step 5: Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `Frontend/.env.local`:

```env
# ── Groq AI ────────────────────────────────────────────────────────────
# Get your free key at https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# ── PostgreSQL ─────────────────────────────────────────────────────────
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/rehnuma_db

# ── JWT Authentication ──────────────────────────────────────────────────
# Use a long random string — generate one with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=replace-this-with-a-long-random-secret
```

> ⚠️ **Never commit `.env.local` to Git.** It is already in `.gitignore`.

### Step 6: Setup ChromaDB (Optional — for RAG)

```bash
cd Scripts
python chromadb_setup.py
```

This creates a vector database from the curated problem-solution pairs in `data/processed/`.

### Step 7: Run the Application

```bash
cd Frontend
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You will be **automatically redirected to the login/signup page** on first visit.

---

## 🔐 Authentication System

Rehnuma uses a full JWT-based authentication system built entirely inside Next.js — no separate auth server required.

### How It Works

```
User opens http://localhost:3000
        ↓
No token in localStorage?
        ↓ YES
Redirect → /auth  (Login / Signup page)
        ↓
User creates account or logs in
        ↓
JWT token stored in localStorage (7-day expiry)
        ↓
Redirect → /  (Main application)
        ↓
Username + Logout button shown in navbar
All API calls include: Authorization: Bearer <token>
```

### Security Details

| Concern           | Implementation                                            |
| ----------------- | --------------------------------------------------------- |
| Password storage  | bcryptjs with **12 salt rounds** — never stored as plain text |
| Session tokens    | JWT signed with `JWT_SECRET`, expires in **7 days**       |
| API protection    | Next.js **Middleware** blocks `/api/generate-*` without valid token |
| Error messages    | Generic "Invalid email or password" to prevent user enumeration |
| Secrets           | All sensitive values in `.env.local` (gitignored)         |

### Auth API Endpoints

| Method | Endpoint                  | Description                          | Auth Required |
| ------ | ------------------------- | ------------------------------------ | ------------- |
| POST   | `/api/auth/signup`        | Create new account                   | No            |
| POST   | `/api/auth/login`         | Login and receive JWT token          | No            |
| GET    | `/api/auth/me`            | Validate token, get current user     | Yes (Bearer)  |
| POST   | `/api/generate-solution`  | Generate AI solution                 | Yes (Bearer)  |
| POST   | `/api/generate-animation` | Generate Manim animation             | Yes (Bearer)  |
| POST   | `/api/generate-quiz`      | Generate 5 MCQs for a topic          | Yes (Bearer)  |
| POST   | `/api/submit-quiz`        | Submit answers, score & persist attempt | Yes (Bearer) |
| GET    | `/api/dashboard`          | Fetch quiz history & aggregate stats | Yes (Bearer)  |

### Database Schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,          -- bcrypt hash
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_attempts (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query            TEXT      NOT NULL,
  score            INTEGER   NOT NULL,
  total_questions  INTEGER   NOT NULL DEFAULT 5,
  answers          JSONB     NOT NULL,  -- user's selected answers
  correct_answers  JSONB     NOT NULL,
  quiz_data        JSONB     NOT NULL,  -- full MCQ objects
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes on user_id and created_at are created automatically.
```

> **Note:** Both tables are created automatically on first use — no manual SQL needed.

---

## 📖 Usage

### First Time Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You are redirected to the **Sign In / Sign Up** page
3. Click **"Sign Up"** tab and create your account
4. You are automatically logged in and redirected to the main page

### Generating a Solution

1. Enter your probability/statistics question in the input field
2. Click **"Generate Solution"**
3. Wait 5-15 seconds for Groq AI to generate a detailed explanation
4. View the step-by-step solution with mathematical formatting

### Generating an Animation

1. Enter your question or select a topic
2. Click **"Generate Animation"**
3. Wait 50-120 seconds for:
   - Solution generation (if not cached)
   - Manim animation code generation via Groq
   - Code validation and execution
   - Video rendering
   - **Voice narration synthesis** — captions from the animation are extracted and read aloud as a tutorial voice-over
4. Watch the animated explanation with synchronized narration in the video player

### Logging Out

- Click the **Logout** button in the top-right navbar
- You are redirected back to the login page
- The JWT token is cleared from localStorage

### Taking a Knowledge Quiz

1. Enter a topic or question in the input field
2. Click **"Generate Quiz"**
3. Wait ~5 seconds for Groq to generate 5 MCQs
4. Select one answer per question (A–D)
5. Click **"Submit Quiz"** — your score and per-question explanations appear instantly
6. Results are saved to your profile automatically

### Viewing Your Performance Dashboard

1. Click **"Dashboard"** in the navbar or the **"View Dashboard"** button after a quiz
2. The `/dashboard` page shows:
   - Total attempts, average score, best score, average percentage
   - Full history of every quiz attempt with date, topic, and score
   - Expandable question-by-question breakdown for each attempt

### Example Questions

```
What is the probability of getting exactly 3 heads in 5 coin flips?

Explain the Central Limit Theorem with an example.

A bag contains 5 red and 3 blue balls. What's the probability of drawing 2 red balls without replacement?

Calculate the expected value of a dice roll.
```

---

## 🏗 Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         User Interface                                │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │  /auth   │→ │   Input    │→ │  Solution  │→ │  Video+Narration │  │
│  │ Login/   │  │  Section   │  │  Section   │  │     Section      │  │
│  │ Signup   │  └────────────┘  └────────────┘  └──────────────────┘  │
│  └──────────┘                                                         │
└───────────────────────────────────────────────────────────────────────┘
                           ↓ JWT Middleware (protects API routes)
┌───────────────────────────────────────────────────────────────────────┐
│                      Next.js API Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐ │
│  │  /api/auth/*      │  │ /api/generate-    │  │ /api/generate-    │ │
│  │  • signup         │  │    solution       │  │    animation      │ │
│  │  • login          │  │  • Cache check    │  │  • Manim codegen  │ │
│  │  • me             │  │  • Groq AI call   │  │  • Auto-fix (3x)  │ │
│  │  bcrypt + JWT     │  │  • 60-min cache   │  │  • Narration gen  │ │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                           ↓
┌───────────────────────────────────────────────────────────────────────┐
│                       Service Layer                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │   db.ts      │  │   auth.ts    │  │   groq.ts    │  │ cache.ts │  │
│  │ PostgreSQL   │  │ bcrypt+JWT   │  │ AI prompts   │  │ TTL mgmt │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                           ↓
┌───────────────────────────────────────────────────────────────────────┐
│                 External Services / Local                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Groq API │  │  PostgreSQL  │  │    Manim     │  │  ChromaDB   │  │
│  │  Cloud   │  │    Local DB  │  │ Local Python │  │ Vector Store│  │
│  └──────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Rehnuma-beta/
├── Frontend/                        # Next.js application
│   ├── app/                         # App Router pages & API routes
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup/route.ts  # POST — create user account
│   │   │   │   ├── login/route.ts   # POST — authenticate & return JWT
│   │   │   │   └── me/route.ts      # GET  — validate token
│   │   │   ├── generate-solution/route.ts   # AI solution (protected)
│   │   │   ├── generate-animation/route.ts  # Manim animation (protected)
│   │   │   ├── generate-quiz/route.ts       # MCQ quiz generation (protected)
│   │   │   ├── submit-quiz/route.ts         # Score & persist quiz attempt (protected)
│   │   │   └── dashboard/route.ts           # Quiz history & stats (protected)
│   │   ├── auth/
│   │   │   └── page.tsx             # Login / Signup UI page
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Performance Dashboard UI page
│   │   ├── page.tsx                 # Main app (requires auth)
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles & theme variables
│   ├── components/
│   │   ├── navbar.tsx               # Navbar (shows username + logout + dashboard link)
│   │   ├── hero-section.tsx
│   │   ├── input-section.tsx
│   │   ├── solution-section.tsx
│   │   ├── quiz-section.tsx         # MCQ quiz UI with scoring & explanations
│   │   ├── video-section.tsx
│   │   ├── footer.tsx
│   │   ├── toast.tsx
│   │   ├── theme-provider.tsx       # Dark/Light theme context
│   │   └── ui/                      # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                    # PostgreSQL client + users & quiz_attempts table setup
│   │   ├── auth.ts                  # bcrypt + JWT utilities
│   │   ├── groq.ts                  # Groq AI integration (solution, animation, quiz)
│   │   ├── manim-executor.ts        # Manim execution + narration
│   │   ├── cache.ts                 # In-memory caching (solution, animation, quiz)
│   │   └── utils.ts                 # Shared utilities
│   ├── middleware.ts                # Pass-through (auth handled per route handler)
│   ├── .env.local                   # 🔒 Secret env vars (NOT committed)
│   ├── .env.example                 # Template — copy to .env.local
│   ├── manim_scripts/               # Generated Manim scripts (gitignored)
│   └── public/videos/               # Generated videos (gitignored)
├── Scripts/                         # Python utility scripts
│   ├── add_narration.py             # Voice narration pipeline
│   ├── chromadb_setup.py            # Vector database setup
│   ├── clt_animation.py             # Sample CLT animation
│   ├── pca_animation.py             # Sample PCA animation
│   ├── graph.py                     # Project timeline chart (ideal vs actual)
│   ├── data_conversion.py           # Data processing utilities
│   └── test-cases.py                # Test suite
├── data/                            # Curated datasets
│   ├── raw/                         # Raw chapter data (JSON)
│   └── processed/                   # Processed problem-solution pairs
├── requirements.txt                 # Python dependencies
├── Rehnuma-Context.md               # LLM context documentation
└── README.md                        # This file
```

---

## 📝 Environment Variables

All variables go in `Frontend/.env.local`. Use `.env.example` as a template.

| Variable         | Required | Description                                                      |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `GROQ_API_KEY`   | ✅ Yes   | Groq API key — free at [console.groq.com](https://console.groq.com/) |
| `DATABASE_URL`   | ✅ Yes   | PostgreSQL connection string (see format below)                  |
| `JWT_SECRET`     | ✅ Yes   | Long random string for signing JWT tokens                        |
| `PYTHON_PATH`    | Optional | Absolute path to Python executable (auto-detected from venv)     |

**`DATABASE_URL` format:**
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
# Example:
postgresql://postgres:mypassword@localhost:5432/rehnuma_db
```

**Generate a secure `JWT_SECRET`:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔌 API Reference

All routes except `/api/auth/*` require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth Routes (No Authentication Required)

#### `POST /api/auth/signup`
```json
// Request
{ "username": "john_doe", "email": "john@example.com", "password": "mypassword" }

// Response 201
{ "message": "Account created successfully!", "user": { "id": 1, "username": "john_doe", "email": "john@example.com" } }
```

#### `POST /api/auth/login`
```json
// Request
{ "email": "john@example.com", "password": "mypassword" }

// Response 200
{ "token": "eyJhbGci...", "user": { "id": 1, "username": "john_doe", "email": "john@example.com" } }
```

#### `GET /api/auth/me`
```
Headers: Authorization: Bearer <token>

// Response 200
{ "user": { "userId": 1, "email": "john@example.com", "username": "john_doe" } }
```

### Protected Routes (JWT Required)

#### `POST /api/generate-solution`
```json
// Request (with Auth header)
{ "query": "What is the probability of rolling a 6 on a fair die?" }

// Response 200
{ "answer": "1. A fair die has 6 equally likely outcomes...", "processing_time": "3.2s", "cached": false }
```

#### `POST /api/generate-animation`
```json
// Request (with Auth header)
{ "query": "Explain the binomial distribution" }

// Response 200
{ "video_url": "/videos/abc123.mp4", "processing_time": "87.4s", "attempts": 1, "cached": false }
```

#### `POST /api/generate-quiz`
```json
// Request (with Auth header)
{ "query": "Explain the binomial distribution" }

// Response 200
{
  "quiz": [
    {
      "question": "What parameter defines the number of trials in a binomial distribution?",
      "options": ["n", "p", "k", "lambda"],
      "correct_answer": "n",
      "explanation": "'n' is the number of independent Bernoulli trials."
    }
    // ... 4 more questions
  ],
  "query": "Explain the binomial distribution",
  "cached": false,
  "processing_time": "4.1s",
  "context_enhanced": true
}
```

#### `POST /api/submit-quiz`
```json
// Request (with Auth header)
{
  "query": "Explain the binomial distribution",
  "answers": ["n", "p", "Both n and p", "np(1-p)", "np"],
  "quiz_data": [ /* quiz array from generate-quiz */ ]
}

// Response 200
{
  "score": 4,
  "total": 5,
  "percentage": 80,
  "breakdown": [
    { "question": "...", "user_answer": "n", "correct_answer": "n", "correct": true, "explanation": "..." }
  ]
}
```

#### `GET /api/dashboard`
```json
// Headers: Authorization: Bearer <token>

// Response 200
{
  "stats": {
    "total_attempts": 12,
    "average_score": 3.8,
    "best_score": 5,
    "average_percentage": 76
  },
  "attempts": [
    { "id": "uuid", "query": "...", "score": 4, "total_questions": 5, "percentage": 80, "created_at": "..." }
  ]
}
```

---

## 🧠 Quiz & Dashboard

Rehnuma includes a full quiz and analytics system built on top of the core AI pipeline.

### How Quiz Generation Works

```
User clicks "Generate Quiz"
        ↓
POST /api/generate-quiz  (JWT protected)
        ↓
Check quizCache  →  Cache HIT?  →  Return cached quiz instantly
        ↓ MISS
Optionally enrich prompt with cached solution text
        ↓
Groq LLM generates 5 MCQs (question + 4 options + correct_answer + explanation)
        ↓
Store in quizCache (TTL)
        ↓
Return quiz to frontend  →  QuizSection component renders questions
```

### How Quiz Submission Works

```
User selects answers and clicks "Submit Quiz"
        ↓
POST /api/submit-quiz  (JWT protected)
        ↓
Score calculated per question  (user_answer === correct_answer)
        ↓
Attempt stored in quiz_attempts table (PostgreSQL)
        ↓
Breakdown + score + percentage returned to frontend
```

### Performance Dashboard

The `/dashboard` page (`GET /api/dashboard`) retrieves:
- **Aggregate stats**: total attempts, average score, best score, average %
- **Attempt history**: last 50 quizzes, ordered by date, with full quiz data for review

Both tables (`users` and `quiz_attempts`) are auto-created on first use via `setupDatabase()` / `setupQuizTable()` in `lib/db.ts`.

---

## 🧪 Running Tests

```bash
# Python tests
cd Scripts
pytest test-cases.py -v

# Frontend type checking
cd Frontend
pnpm tsc --noEmit
```

---

## 🤝 Contributing

We welcome contributions from all team members! Follow these steps:

### Getting Started

1. **Pull latest changes** before starting work:
   ```bash
   git pull origin main
   ```

2. **Create a feature branch** named descriptively:
   ```bash
   git checkout -b feature/your-feature-name
   # Examples:
   # feature/add-user-history
   # fix/animation-timeout
   # chore/update-dependencies
   ```

3. **Set up your environment** — copy `.env.example` to `.env.local` and fill in real values (ask a team member for the shared Groq key and DB credentials for dev).

4. **Make your changes**, keeping commits atomic:
   ```bash
   git add .
   git commit -m "feat: add user query history endpoint"
   ```

5. **Push and open a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Guidelines

- **Never commit `.env.local`** — it's gitignored for security
- **Never commit API keys or passwords** anywhere in code
- Follow the existing code style (TypeScript, no `any` types where avoidable)
- Add comments for non-obvious logic — other developers will read your code
- Test your changes locally before pushing: `npm run dev`
- Keep the auth system intact — do not remove JWT headers from fetch calls in `page.tsx`

### Branch Naming Convention

| Prefix     | Use For                                  |
| ---------- | ---------------------------------------- |
| `feature/` | New features                             |
| `fix/`     | Bug fixes                                |
| `chore/`   | Maintenance, dependency updates          |
| `docs/`    | Documentation changes only               |
| `refactor/`| Code restructuring without feature change|

### Areas Open for Contribution

- [x] User quiz generation and scoring
- [x] Performance dashboard with analytics
- [ ] User query history (save past solution queries per user)
- [ ] Additional problem types (linear algebra, calculus)
- [ ] More Manim animation templates
- [ ] Performance optimizations for caching
- [ ] Mobile-responsive improvements
- [ ] Multi-language support (Urdu interface)
- [ ] Admin dashboard for managing users

---

## ❓ Common Issues

### "DATABASE_URL is not set" error
Make sure `Frontend/.env.local` exists and contains `DATABASE_URL`. It is **not** committed to git — you must create it from `.env.example`.

### "Invalid or expired token" on page load
Your JWT may have expired (7-day limit). Click Logout and log in again, or clear `rehnuma_token` from localStorage in DevTools.

### PostgreSQL connection refused
- Ensure PostgreSQL is running: `pg_ctl status` or check Services in Windows
- Verify the port matches your `DATABASE_URL` (default 5432, yours may be 5433)
- Check username/password are correct

### Manim not found
```bash
pip install manim
manim --version
```
If auto-detection fails, set `PYTHON_PATH` in `.env.local` to your Python executable path.

### Animation times out
Reduce query complexity or increase the timeout in `lib/manim-executor.ts`. Typical render: 50-120s.

---

## 📄 License

This project is part of an academic Final Year Project. Please contact the authors for licensing information.

---

## 👥 Authors

- **Faseeh Iqbal** — [GitHub](https://github.com/fasih-iqbal)
- **Faseeh Iqbal** — [GitHub](https://github.com/Hasankhan2003)

---

<p align="center">
  Made with ❤️ for students who struggle with probability and statistics
</p>

<p align="center">
  <strong>⭐ Star this repo if you found it helpful! ⭐</strong>
</p>
