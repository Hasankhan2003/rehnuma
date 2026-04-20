# Rehnuma Project Context Document

> **Purpose:** This document provides comprehensive context about the Rehnuma project for LLMs, AI assistants, and new contributors. It contains all essential information needed to understand, modify, and extend the codebase.

---

## 1. Project Identity

| Attribute            | Value                                      |
| -------------------- | ------------------------------------------ |
| **Name**             | Rehnuma (رہنما - "The Guide" in Urdu)      |
| **Type**             | AI-Powered Educational Platform            |
| **Domain**           | Probability & Statistics Tutoring          |
| **Phase**            | Phase 2 Complete (Beta)                    |
| **Primary Language** | TypeScript (Frontend), Python (Animations) |

---

## 2. Core Functionality

Rehnuma solves two primary problems for students learning probability and statistics:

### 2.1 Solution Generation

- User inputs a probability/statistics question
- Google Gemini AI generates detailed step-by-step solutions
- Solutions include mathematical notation, explanations, and interpretations
- Cached for 60 minutes using SHA-256 hash of query

### 2.2 Animation Generation

- User requests visual explanation of a concept
- System generates a mathematical solution (if not cached)
- Gemini AI generates Manim Python code based on solution
- Manim renders the animation to MP4 video
- Auto-retry with error fixing (up to 3 attempts)
- Videos cached for 120 minutes

---

## 3. Technology Stack Details

### 3.1 Frontend Stack

```
Next.js 16.0.7 (App Router)
├── React 19.2.0
├── TypeScript 5.x
├── Tailwind CSS 4.1.9
├── shadcn/ui (new-york style)
│   └── Radix UI primitives
├── Lucide React (icons)
└── next-themes (dark/light mode)
```

### 3.2 Backend Stack

```
Next.js API Routes
├── @google/generative-ai 0.24.1
│   ├── gemini-2.5-pro (primary model)
│   └── gemini-2.5-flash (fallback model)
├── In-memory cache (Map-based)
└── Child process execution (Manim)
```

### 3.3 Python Stack

```
Python 3.8+
├── manim (Mathematical Animation Engine)
├── numpy (numerical operations)
├── langchain + langchain-community (RAG)
├── chromadb (vector database)
├── sentence-transformers (embeddings)
│   └── all-MiniLM-L6-v2 model
└── pytest (testing)
```

---

## 4. Complete File Structure with Descriptions

```
Rehnuma-beta/
│
├── Frontend/                          # Next.js application root
│   │
│   ├── app/                           # Next.js App Router
│   │   ├── globals.css                # Global styles (Tailwind imports)
│   │   ├── layout.tsx                 # Root layout with theme provider
│   │   ├── page.tsx                   # Main page composing all sections
│   │   │
│   │   └── api/                       # Backend API routes
│   │       ├── generate-solution/
│   │       │   └── route.ts           # POST /api/generate-solution
│   │       │                          # - Validates query
│   │       │                          # - Checks cache
│   │       │                          # - Calls Gemini AI
│   │       │                          # - Returns cleaned solution
│   │       │
│   │       └── generate-animation/
│   │           └── route.ts           # POST /api/generate-animation
│   │                                  # - Generates solution first
│   │                                  # - Generates Manim code
│   │                                  # - Executes Manim
│   │                                  # - Handles retries
│   │                                  # - Returns video URL
│   │
│   ├── components/                    # React UI components
│   │   ├── hero-section.tsx           # Landing page hero with title/description
│   │   ├── input-section.tsx          # Query input form with submit button
│   │   ├── solution-section.tsx       # Displays AI-generated solutions
│   │   ├── video-section.tsx          # Video player for animations
│   │   ├── navbar.tsx                 # Top navigation bar
│   │   ├── footer.tsx                 # Page footer
│   │   ├── theme-provider.tsx         # next-themes wrapper
│   │   ├── toast.tsx                  # Toast notification component
│   │   │
│   │   └── ui/                        # shadcn/ui components (50+ files)
│   │       ├── button.tsx             # Primary button component
│   │       ├── card.tsx               # Card container
│   │       ├── input.tsx              # Text input
│   │       ├── textarea.tsx           # Multi-line input
│   │       ├── dialog.tsx             # Modal dialogs
│   │       ├── tabs.tsx               # Tab navigation
│   │       ├── accordion.tsx          # Collapsible sections
│   │       ├── skeleton.tsx           # Loading placeholders
│   │       ├── spinner.tsx            # Loading spinner
│   │       └── [40+ other components] # Full shadcn/ui library
│   │
│   ├── lib/                           # Core utility libraries
│   │   │
│   │   ├── gemini.ts                  # Gemini AI integration
│   │   │   # Exports:
│   │   │   # - generateSolution(query): Promise<string>
│   │   │   # - generateManimCode(solution, query): Promise<string>
│   │   │   # Features:
│   │   │   # - Multiple API key rotation
│   │   │   # - Automatic fallback to gemini-2.5-flash
│   │   │   # - Detailed prompt engineering
│   │   │
│   │   ├── manim-executor.ts          # Manim subprocess execution
│   │   │   # Exports:
│   │   │   # - executeManimCode(code): Promise<{success, videoPath, error}>
│   │   │   # Features:
│   │   │   # - Writes .py file to manim_scripts/
│   │   │   # - Executes via child_process.exec()
│   │   │   # - Parses stdout/stderr for errors
│   │   │   # - Locates output video file
│   │   │
│   │   ├── manim-validator.ts         # Code validation & fixing
│   │   │   # Exports:
│   │   │   # - validateManimCode(code): {valid, errors}
│   │   │   # - fixManimCode(code, errors): Promise<string>
│   │   │   # Features:
│   │   │   # - Syntax checking
│   │   │   # - Common error pattern detection
│   │   │   # - AI-powered error fixing
│   │   │
│   │   ├── cache.ts                   # In-memory caching system
│   │   │   # Exports:
│   │   │   # - solutionCache: Map with 60-min TTL
│   │   │   # - animationCache: Map with 120-min TTL
│   │   │   # - getCacheKey(query): SHA-256 hash
│   │   │   # Features:
│   │   │   # - Automatic TTL expiration
│   │   │   # - Memory-efficient storage
│   │   │
│   │   ├── output-cleaner.ts          # Solution text processing
│   │   │   # Exports:
│   │   │   # - cleanOutput(rawText): string
│   │   │   # Features:
│   │   │   # - Removes markdown artifacts
│   │   │   # - Formats sections consistently
│   │   │   # - Handles LaTeX preservation
│   │   │
│   │   ├── error-parser.ts            # Manim error parsing
│   │   │   # Exports:
│   │   │   # - parseError(stderr): {type, line, message}
│   │   │   # Features:
│   │   │   # - Python traceback parsing
│   │   │   # - Manim-specific error detection
│   │   │
│   │   ├── gemini-manim-prompt.txt    # 657-line prompt template
│   │   │   # Contains:
│   │   │   # - Anti-error rules (positioning vs styling)
│   │   │   # - Mandatory imports and setup
│   │   │   # - Color coding guidelines
│   │   │   # - Animation timing rules
│   │   │   # - Working code examples
│   │   │   # - Common error patterns to avoid
│   │   │
│   │   └── utils.ts                   # General utilities (cn function)
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-toast.ts               # Toast notification hook
│   │   └── use-mobile.ts              # Mobile detection hook
│   │
│   ├── manim_scripts/                 # Generated Python scripts
│   │   ├── .gitignore                 # Ignores *.py files
│   │   └── [hash].py                  # SHA-256 named generated scripts
│   │
│   ├── public/                        # Static assets
│   │   └── videos/                    # Generated MP4 videos
│   │       ├── .gitignore             # Ignores *.mp4 files
│   │       └── [hash].mp4             # Rendered animations
│   │
│   ├── styles/
│   │   └── globals.css                # Additional global styles
│   │
│   ├── package.json                   # Node.js dependencies
│   ├── pnpm-lock.yaml                 # Locked dependency versions
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── next.config.mjs                # Next.js configuration
│   ├── postcss.config.mjs             # PostCSS configuration
│   ├── components.json                # shadcn/ui configuration
│   └── .gitignore                     # Frontend-specific ignores
│
├── Scripts/                           # Python utility scripts
│   │
│   ├── chromadb_setup.py              # Vector database initialization
│   │   # Creates ChromaDB from data/processed/prob_solution.json
│   │   # Uses HuggingFaceEmbeddings (all-MiniLM-L6-v2)
│   │   # Outputs to chroma_db/ directory
│   │
│   ├── clt_animation.py               # Central Limit Theorem animation
│   │   # Example Manim script demonstrating CLT
│   │   # Uses histograms, normal curves, sample distributions
│   │
│   ├── pca_animation.py               # PCA visualization animation
│   │   # Example Manim script for Principal Component Analysis
│   │   # Shows dimensionality reduction concepts
│   │
│   ├── data_conversion.py             # Data processing utilities
│   │   # Converts raw text/book data to JSON format
│   │   # Used during initial dataset creation
│   │
│   ├── graph.py                       # Matplotlib visualization utilities
│   │   # Helper for creating static graphs
│   │
│   └── test-cases.py                  # Pytest test suite
│       # Tests for caching, validation, API responses
│
├── data/                              # Curated educational content
│   │
│   ├── raw/                           # Original chapter data
│   │   ├── chapter2.json              # Probability basics
│   │   ├── chapter3.json              # Discrete random variables
│   │   ├── chapter4.json              # Continuous distributions
│   │   ├── chapter5.json              # Joint distributions
│   │   ├── chapter7.json              # Point estimation
│   │   ├── chapter8.json              # Confidence intervals
│   │   ├── chapter9.json              # Hypothesis testing
│   │   ├── chapter10.json             # Statistical inference
│   │   ├── chapter11.json             # Regression
│   │   ├── chapter12.json             # ANOVA
│   │   ├── chapter13.json             # Factorial experiments
│   │   ├── chapter14.json             # Nonparametric methods
│   │   ├── chapter15.json             # Quality control
│   │   ├── prob_raw_solution.json     # Raw solution data
│   │   └── prob_solution_book.txt     # Source textbook content
│   │
│   └── processed/                     # Cleaned and formatted data
│       ├── prob_solution.json         # Main dataset (2440 lines)
│       │   # Structure: [{id, topic, problem, theory, solution, animation_hint}]
│       ├── prob_ch3.json              # Chapter 3 specific problems
│       ├── prob_sample1.json          # Sample problem set 1
│       ├── prob_sample2.json          # Sample problem set 2
│       └── prob_solution_backup.json  # Backup of main dataset
│
├── .gitignore                         # Root-level git ignores
├── requirements.txt                   # Python dependencies
├── README.md                          # Project documentation
└── Rehnuma-Context.md                 # This file
```

---

## 5. Key Data Structures

### 5.1 Problem-Solution JSON Schema

```typescript
interface ProblemSolution {
  id: string; // Unique identifier (e.g., "discrete_rv_range_basic_ex_3_1")
  topic: string; // Chapter/topic name
  problem: string; // The question text
  "theory/description": string; // Theoretical background
  "solution/explanation": string; // Step-by-step solution
  "animation_hint/metadata": {
    visual_focus: string; // What to emphasize visually
    objects_to_animate: string; // Manim objects to create
    animation_style: string; // How to animate
    color_coding: string; // Color scheme
    narration_summary: string; // Optional narration text
  };
}
```

### 5.2 Cache Entry Structure

```typescript
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // milliseconds
}

// Solution cache: 60 minutes TTL
// Animation cache: 120 minutes TTL
```

### 5.3 API Response Structures

```typescript
// POST /api/generate-solution
interface SolutionResponse {
  solution: string;
  cached: boolean;
}

// POST /api/generate-animation
interface AnimationResponse {
  videoUrl: string; // e.g., "/videos/abc123.mp4"
  solution: string;
  cached: boolean;
  retryCount?: number;
}
```

---

## 6. Critical Implementation Details

### 6.1 Gemini API Key Rotation

The system uses up to 3 API keys with automatic fallback:

```typescript
// Pseudo-code from gemini.ts
const apiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean);

async function callGemini(prompt) {
  for (const key of apiKeys) {
    try {
      return await makeRequest(key, prompt);
    } catch (error) {
      if (isRateLimitError(error)) continue;
      throw error;
    }
  }
  // If all keys fail, try fallback model
  return await callWithFallbackModel(prompt);
}
```

### 6.2 Manim Code Generation Anti-Patterns

The prompt template (gemini-manim-prompt.txt) enforces critical rules:

```python
# ❌ WRONG - Causes immediate crash
Text("Hello").next_to(obj, DOWN, font_size=36)  # Styling in positioning!

# ✅ CORRECT - Styling in constructor only
text = Text("Hello", font_size=36, color=BLACK)
text.next_to(obj, DOWN, buff=0.5)
```

**Key Rule:** `font_size`, `color`, `stroke_width` → ONLY in constructors  
**Positioning methods only accept:** `buff`, `aligned_edge`, vectors

### 6.3 Manim Execution Flow

```
1. Generate Manim Python code via Gemini
2. Write to Frontend/manim_scripts/{hash}.py
3. Execute: manim -pql {hash}.py GeneratedScene
4. Parse output for video path or errors
5. If error: Parse traceback → Fix via Gemini → Retry (max 3)
6. Copy video to Frontend/public/videos/{hash}.mp4
7. Return URL: /videos/{hash}.mp4
```

### 6.4 Cache Key Generation

```typescript
function getCacheKey(query: string): string {
  return crypto
    .createHash("sha256")
    .update(query.trim().toLowerCase())
    .digest("hex");
}
```

---

## 7. Environment Configuration

### Required Environment Variables

| Variable           | Location            | Description              |
| ------------------ | ------------------- | ------------------------ |
| `GEMINI_API_KEY`   | Frontend/.env.local | Primary Gemini API key   |
| `GEMINI_API_KEY_2` | Frontend/.env.local | Backup key (optional)    |
| `GEMINI_API_KEY_3` | Frontend/.env.local | Second backup (optional) |

### ChromaDB Configuration (in chromadb_setup.py)

| Setting         | Value                                    |
| --------------- | ---------------------------------------- |
| Embedding Model | `sentence-transformers/all-MiniLM-L6-v2` |
| Database Path   | `chroma_db/`                             |
| Data Source     | `data/processed/prob_solution.json`      |

---

## 8. Common Operations

### 8.1 Adding New UI Components

```bash
# Using shadcn/ui CLI
cd Frontend
npx shadcn@latest add [component-name]
```

### 8.2 Regenerating ChromaDB

```bash
# Delete existing database
rm -rf chroma_db/

# Regenerate from data
cd Scripts
python chromadb_setup.py
```

### 8.3 Testing Manim Locally

```bash
# Run a sample animation
cd Scripts
manim -pql clt_animation.py CentralLimitTheorem
```

### 8.4 Adding New Problem Data

1. Add problems to `data/processed/prob_solution.json`
2. Follow the schema in Section 5.1
3. Regenerate ChromaDB if using RAG

---

## 9. Performance Characteristics

| Operation            | Typical Time   | Notes                      |
| -------------------- | -------------- | -------------------------- |
| Solution generation  | 15-25s         | Gemini API call            |
| Animation generation | 50-120s        | Includes solution + render |
| Cache hit            | <50ms          | In-memory lookup           |
| Manim render         | 30-60s         | CPU-bound                  |
| Error retry          | +70% per retry | With AI-powered fixing     |

### Resource Usage

- **Memory:** ~200-300MB (Next.js) + ~500MB (during Manim render)
- **CPU:** 90%+ single core during animation render
- **Disk:** Each animation ~5-10MB, scripts ~10-50KB

---

## 10. Error Handling Patterns

### API Error Responses

```typescript
// Standard error format
{
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "details": { /* optional debugging info */ }
}
```

### Manim Error Categories

| Error Type       | Cause                   | Auto-Fix Strategy          |
| ---------------- | ----------------------- | -------------------------- |
| `NameError`      | Undefined variable      | Add to imports/definitions |
| `TypeError`      | Wrong argument types    | Fix method signatures      |
| `AttributeError` | Invalid property access | Correct property names     |
| `ValueError`     | Invalid values          | Adjust parameters          |
| `SyntaxError`    | Python syntax issues    | Full code regeneration     |

---

## 11. Extension Points

### Adding New Subjects

1. Create new data files in `data/processed/`
2. Update ChromaDB setup to include new files
3. Optionally create subject-specific prompts in `lib/`

### Adding New Visualization Types

1. Create example scripts in `Scripts/`
2. Add patterns to `gemini-manim-prompt.txt`
3. Test with sample problems

### Integrating New AI Models

1. Update `Frontend/lib/gemini.ts`
2. Adjust prompt formatting as needed
3. Update error handling for new API patterns

---

## 12. Known Limitations

1. **In-memory cache:** Lost on server restart; consider Redis for production
2. **Single-threaded rendering:** One animation at a time
3. **No user authentication:** All content publicly accessible
4. **No persistent storage:** Videos not preserved across deployments
5. **Manim dependency:** Requires local Python environment

---

## 13. Future Roadmap (Phase 3+)

- [ ] User accounts and progress tracking
- [ ] Persistent video storage (S3/Cloud Storage)
- [ ] Real-time collaboration features
- [ ] Additional subject areas
- [ ] Mobile application
- [ ] Audio narration integration
- [ ] Interactive quizzes

---

## 14. Quick Reference Commands

```bash
# Start development server
cd Frontend && pnpm dev

# Build for production
cd Frontend && pnpm build

# Run Python tests
cd Scripts && pytest -v

# Check TypeScript
cd Frontend && pnpm tsc --noEmit

# Regenerate vector database
python Scripts/chromadb_setup.py

# Test Manim installation
manim --version

# Create new UI component
npx shadcn@latest add button
```

---

## 15. Contact & Support

- **Repository:** https://github.com/fasih-iqbal/Rehnuma-beta
- **Author:** Fasih Iqbal

---

_Last Updated: March 2026 | Phase 2 Release_
