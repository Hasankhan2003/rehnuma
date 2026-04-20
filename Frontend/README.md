# Rehnuma - AI-Powered Probability & Statistics Tutor

A Next.js application that generate detailed solutions and animated visualizations for probability and statistics problems.

## 🎬 NEW: Audio-Synchronized Animations!

Rehnuma now generates **professional narrated animations**

## Features

- **AI-Powered Solutions**: Get step-by-step explanations for probability and statistics problems
- **Animated Visualizations**: Generate Manim-powered video animations to visualize concepts
- **Smart Caching**: Server-side caching (24-hour) prevents redundant rendering
- **Conditional Workflows**: Solutions are automatically generated when requesting animations
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   - Download from [nodejs.org](https://nodejs.org/)

2. **pnpm** (Package Manager)

   ```bash
   npm install -g pnpm
   ```

3. **Python** (v3.8 or higher)

   - Download from [python.org](https://www.python.org/downloads/)

4. **Manim Community Edition** (for animation generation)

   ```bash
   pip install manim
   ```

   For detailed installation instructions, visit: [Manim Installation Guide](https://docs.manim.community/en/stable/installation.html)

5. **Audio Pipeline Dependencies** (for narrated animations)

   ```bash
   pip install TTS soundfile numpy
   ```

   **Quick Setup**: Run the automated setup script:

   ```bash
   # Windows PowerShell
   .\setup-audio-sync.ps1
   ```

## Installation

1. **Clone the repository**

   ```bash
   cd Frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the `Frontend` directory:

   ```env
   API_KEY=your_actual_api_key_here
   ```

   ⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

4. **Verify Manim installation**

   ```bash
   manim --version
   ```

   You should see output like: `Manim Community v0.x.x`

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing the Application

1. **Test Solution Generation**:

   - Enter a question like "Explain Bayes' theorem with an example"
   - Click "Generate Solution"
   - The solution section should appear with a detailed explanation

2. **Test Animation Generation**:

   - Enter a question like "Visualize binomial distribution"
   - Click "Generate Animation"
   - Wait 1-2 minutes for Manim to render the video
   - The video section should appear with the generated animation
   - Click "View Text Solution" to see the buffered solution

3. **Test Caching**:
   - Submit the same question twice
   - The second request should return instantly from cache

## Project Structure

```
Frontend/
├── app/
│   ├── api/
│   │   ├── generate-solution/route.ts  # Solution generation endpoint
│   │   └── generate-animation/route.ts # Animation generation endpoint
│   ├── globals.css                     # Global styles and animations
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Main application page
├── components/
│   ├── hero-section.tsx                # Hero/landing section
│   ├── input-section.tsx               # Question input form
│   ├── solution-section.tsx            # Solution display
│   ├── video-section.tsx               # Animation display
│   └── ui/                             # UI components (buttons, cards, etc.)
├── lib/
│   ├── gemini.ts                       # Gemini API client
│   ├── manim-executor.ts               # Manim execution logic
│   ├── cache.ts                        # In-memory caching system
│   └── utils.ts                        # Utility functions
├── manim_scripts/                      # Generated Python scripts (gitignored)
├── public/
│   └── videos/                         # Generated video files (gitignored)
├── .env.local                          # Environment variables (gitignored)
└── package.json                        # Dependencies and scripts
```

## API Routes

### POST /api/generate-solution

Generate a detailed solution for a question.

**Request Body:**

```json
{
  "query": "Explain Bayes' theorem with an example"
}
```

**Response:**

```json
{
  "answer": "Detailed step-by-step explanation...",
  "processing_time": "2.45s",
  "sources": [
    {
      "topic": "Bayes' Theorem",
      "problem": "Related to: Explain Bayes' theorem..."
    }
  ],
  "cached": false
}
```

### POST /api/generate-animation

Generate both a solution and an animated visualization.

**Request Body:**

```json
{
  "query": "Visualize binomial distribution"
}
```

**Response:**

```json
{
  "video_url": "/videos/abc123def456.mp4",
  "processing_time": "45.23s",
  "attempts": 1,
  "animation_id": "abc123def456",
  "solution": {
    "answer": "Detailed explanation...",
    "processing_time": "2.15s",
    "sources": [...]
  },
  "cached": false
}
```

## Deployment to Vercel

### Prerequisites for Production

⚠️ **Important Note**: Manim requires Python and system-level dependencies that are **not available in Vercel's serverless environment**. The animation generation feature will **not work on Vercel** without modifications.

### Options for Production Deployment

#### Option 1: Deploy with Solution Generation Only (Recommended)

Deploy to Vercel with only the solution generation feature active:

1. **Prepare for deployment**

   ```bash
   pnpm build
   ```

2. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Set environment variables in Vercel Dashboard**

   - Go to your project settings
   - Add `GEMINI_API_KEY` with your API key

5. **Disable animation feature** (temporarily):
   - Hide the "Generate Animation" button in production
   - Or redirect animation requests to show an error message

#### Option 2: Hybrid Architecture (Advanced)

For full functionality with animations:

1. **Deploy Frontend to Vercel** (solution generation only)
2. **Deploy a separate Manim service** on:

   - **Railway** (supports Docker)
   - **Render** (supports background workers)
   - **Google Cloud Run** (supports containers)
   - **AWS Lambda with custom runtime**

3. **Update the animation API route** to call the external Manim service

#### Option 3: Self-Hosted (Full Features)

Deploy on a VPS or cloud server with Python support:

1. **Recommended platforms**:

   - DigitalOcean Droplet
   - AWS EC2
   - Google Compute Engine
   - Linode

2. **Setup script** (Ubuntu/Debian):

   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Python and dependencies
   sudo apt-get install -y python3 python3-pip
   pip3 install manim

   # Install pnpm
   npm install -g pnpm

   # Clone and setup
   cd Frontend
   pnpm install
   pnpm build

   # Run with PM2
   npm install -g pm2
   pm2 start npm --name "rehnuma" -- start
   ```

## Caching Behavior

The application implements in-memory caching to optimize performance:

- **Solution Cache**: 60 minutes TTL
- **Animation Cache**: 120 minutes TTL (longer due to expensive generation)
- **Cache Key**: SHA-256 hash of the normalized query
- **Automatic Cleanup**: Expired entries are removed every 15 minutes

### Cache Statistics

The caching system logs statistics to the console:

```
[API] Returning cached solution
[API] Cache size - Solutions: 12, Animations: 5
```

### Manual Cache Clear

Caches are automatically cleared when:

- The server restarts
- Entries expire (based on TTL)

To manually clear caches during development, restart the dev server.

## Troubleshooting

### "API_KEY is not configured"

**Solution**: Ensure `.env.local` exists with your API key:

```env
API_KEY=your_key_here
```

### "manim: command not found"

**Solution**: Install Manim Community Edition:

```bash
pip install manim
```

Verify installation:

```bash
manim --version
```

### Animation generation fails

**Common causes**:

1. **Manim not installed**: See above
2. **Python not in PATH**: Ensure Python is accessible from the command line
3. **Timeout**: Complex animations may exceed the 2-minute timeout
4. **Invalid Python code**: The generated code may have syntax errors

**Debug steps**:

1. Check the console logs for detailed error messages
2. Inspect the generated Python files in `manim_scripts/`
3. Try running the Manim command manually:
   ```bash
   cd manim_scripts
   manim -pql [filename].py GeneratedScene
   ```

### Videos not appearing after generation

**Solution**: Ensure `public/videos/` directory exists and has write permissions:

```bash
mkdir -p public/videos
chmod 755 public/videos
```

### Cache not working

**Solution**: Check that the server hasn't restarted. In-memory caches are cleared on restart. For persistent caching, consider implementing Redis.

## Performance Considerations

### Solution Generation

- Average time: 15-25 seconds
- Depends on query complexity
- Cached responses: < 100ms

### Animation Generation

- Average time: 50-120 seconds
- Includes solution generation (~10s) + Manim rendering (~50-120s)
- Auto-retry on failure (up to 3 attempts)
- Cached responses: < 100ms

### Resource Usage

- **Memory**: ~200-300MB for Next.js + ~500MB during Manim rendering
- **CPU**: High during Manim rendering (90%+)
- **Disk**: Videos stored in `public/videos/` (~5-10MB each)

### Optimization Tips

1. **Enable caching** to reduce API calls
2. **Clean up old videos** periodically (automatic after 24 hours)
3. **Use low quality** Manim rendering (`-pql`) for faster generation
4. **Limit concurrent animations** to prevent resource exhaustion

## Video Storage Management

Videos are stored in `public/videos/` and grow over time. The system includes:

1. **Automatic Cleanup**: Videos older than 24 hours are deleted before new generation
2. **Manual Cleanup**: Run this periodically if needed:
   ```bash
   # Delete videos older than 24 hours
   find public/videos -name "*.mp4" -mtime +1 -delete
   ```

## Security

- ✅ API key is stored server-side only (`.env.local`)
- ✅ Never exposed to client-side code
- ✅ Input sanitization prevents prompt injection
- ✅ Request validation on all API routes
- ✅ Error messages don't leak sensitive information

## Contributing

When contributing, ensure:

1. All environment variables are documented
2. New dependencies are added to `package.json`
3. API routes include proper error handling
4. Code follows the existing style conventions

## Support

For issues or questions:

- Check the Troubleshooting section above
- Review console logs for detailed error messages
- Open an issue on GitHub
