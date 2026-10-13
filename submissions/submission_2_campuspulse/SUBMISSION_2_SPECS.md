# 📋 Submission 2: CampusPulse 360 — Directives, Architecture & Assets

> **Design System (Figma):** [https://www.figma.com/make/zxj9fMS5uKSFW0ziLkNkgs/Design-System-for-FlagHorizon-Sentinel?p=f&t=k195pAe5QwQxbqGG-0](https://www.figma.com/make/zxj9fMS5uKSFW0ziLkNkgs/Design-System-for-FlagHorizon-Sentinel?p=f&t=k195pAe5QwQxbqGG-0)  
> **Status:** Prepped & Isolated for Submission 2 Execution  
> **Note:** DO NOT modify Vercel for Submission 1. These directives are strictly for Submission 2.

---

after properly completing submission 1 in local host do below things 
Part 1: High-Performance vercel.json (Optimized for Scale)
Place this advanced vercel.json file in your root directory. It configures custom caching headers for static assets, enables compression, and handles clean routing for single-page applications under heavy load:

JSON
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "dest": "/assets/$1"
    },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
Part 2: The High-Concurrency Engineering Prompt for Vercel Deployment
Copy and paste this master prompt into your development environment. It explicitly commands the AI to build a scale-proof architecture capable of supporting 5k–10k concurrent users:

Markdown
# MASTER DIRECTIVE: HIGH-CONCURRENCY SCALING & VERCEL DEPLOYMENT PROTOCOL

You are acting as a Principal Distributed Systems Engineer and Lead Frontend Architect. We are deploying a high-performance web application to Vercel that will experience heavy evaluation traffic (5,000 to 10,000 active users). 

The application consumes the Render72 public API (`https://render72.pages.dev`). Under a 10k user load, unoptimized code or raw, repeated API calls will cause latency spikes, client-side crashes, or rate-limiting. You must architect the application to handle high concurrency flawlessly.

---

## CRITICAL SCALING & ARCHITECTURE REQUIREMENTS:

### 1. AGGRESSIVE CLIENT & EDGE CACHING LAYER
- **API Response Caching:** Implement a robust caching wrapper (using `localStorage`, `sessionStorage`, or an in-memory cache with SWR/TanStack Query patterns) for the event list (`/api/test/events`)[cite: 11, 12] and detail payloads (`/api/test/events/{id}`)[cite: 4]. Once fetched, event data must be cached for at least 5–10 minutes to prevent redundant network requests when thousands of users browse simultaneously.
- **Debounced Search & Filtering:** Ensure real-time search inputs and tag/category filters are heavily debounced (300ms) to eliminate unnecessary CPU rendering cycles on client browsers.

### 2. PERFORMANCE BUDGET & BUNDLE OPTIMIZATION
- **Code Splitting:** Lazy-load heavy components (such as deep-dive modal drawers, schedule breakdown tables, and interactive media galleries) using React `lazy` and `Suspense`.
- **Asset Compression:** Optimize all images, icons, and fonts. Use responsive image sizing matching the API's spec (`1200x800` cover images, `1920x1080` banners)[cite: 5, 12] with lazy loading (`loading="lazy"`) to preserve bandwidth under heavy load.

### 3. RESILIENCE & ERROR BOUNDARIES
- **Network Graceful Degradation:** If the Render72 API experiences latency or temporary packet drops under 10k concurrent requests, the UI must never crash. Implement global Error Boundaries and fallback UI states (e.g., serving cached fallback data with a subtle "offline/syncing" badge).
- **Zero Memory Leaks:** Clean up all active listeners, timers, and async polling intervals inside component lifecycle hooks.

### 4. VERCEL DEPLOYMENT & HEADERS MANIFEST
- Ensure the project builds cleanly with zero console warnings or errors via `npm run build`.
- Structure the routing and static output directories (`dist` or `.next`) so Vercel's global Edge Network can cache static assets instantly across multiple regions.

Please review our component tree, implement these high-concurrency caching and performance strategies, and output the production-ready code structure.
Part 3: Verification Checklist Before Pushing to Vercel
Environment Variables: Verify that your API base URL is securely stored as an environment variable in the Vercel dashboard:

VITE_API_URL = [https://render72.pages.dev](https://render72.pages.dev)

[cite: 3, 11]

Build Test: Run npm run build locally to guarantee there are no TypeScript or bundling errors before deploying.

Lighthouse Audit: Run a quick Chrome Lighthouse performance audit on your local build to ensure your Performance and Best Practices scores are above 90, guaranteeing smooth rendering for thousands of simultaneous visitors.

Part 2: Figma Design File PromptIf you need a prompt to generate or structure your Figma layout, use this directive:PlaintextAct as a Principal UI/UX Design Director. Create a high-end, venture-backed SaaS design system and page wireframe blueprint for our hackathon web application consuming the Render72 Events API.

Design Specifications:
1. Visual Theme: Dark-mode-first architecture (Deep charcoal #0F172A background, neon emerald #10B981 and electric indigo accent glows, high-contrast typography using Inter/Plus Jakarta Sans).
2. Key Layout Screens:
   - Hero Command Center: Live search bar, category filter pills (Hackathon, Workshop, etc.), and featured carousel.
   - Interactive Event Grid: Responsive cards with dynamic badges (Active/Closed, Price, Team Size), smooth hover elevation, and registration countdown clocks.
   - Deep-Dive Drawer/Modal: Split view displaying full IST schedules, prize distribution ladders, organizer contact registries, and seamless modal state transitions.
3. Micro-Interactions: Skeleton loaders for API fetching, toast notifications for user actions, and clean empty states for filter misses.
Part 3: Git Repository Architecture & Elite READMERecommended Repository TreePlaintextrender72-event-command-center/
├── public/                 # Static assets, vector logos, favicons
├── src/
│   ├── components/         # Reusable UI (Navbar, EventCard, ScheduleTable, Modal, Footer)
│   ├── services/           # API integration layer (fetching from render72.pages.dev)
│   ├── hooks/              # Custom reactive hooks (useEvents, useDebounce)
│   ├── styles/             # Tailwind CSS & global animations
│   ├── App.jsx             # Main routing and layout entry
│   └── main.jsx            # DOM mounting point
├── .env.example            # Environment variables template
├── .gitignore              # Standard ignore configurations
├── vercel.json             # Vercel deployment routing manifest
├── package.json            # Project dependencies and build scripts
└── README.md               # Elite jury documentation (provided below)
The Elite README.md (Featuring Mermaid Diagrams)Copy and paste this markdown directly into your repository's README.md file:Markdown# ⚡ Render72 Event Command Center

> An elite, high-performance web application engineered for the Render72 online hackathon. It delivers real-time event discovery, dynamic filtering, interactive scheduling, and an unforgettable user experience powered by the official Render72 API.

---

## 🔗 Quick Links
- **Live Production URL:** [View on Vercel](https://your-vercel-deployment.vercel.app)
- **UI/UX Design System:** [Figma Design File](https://figma.com/@your-design-link)
- **Data Source:** [Render72 Events API](https://render72.pages.dev)[cite: 3, 11]

---

## 🏛️ System Architecture & Data Flow

The diagram below illustrates how client requests flow through our frontend application to fetch summary lists and retrieve deeply nested event details from the Render72 public API[cite: 3, 4, 11, 12].

```mermaid
graph TD
    User["👨💻 Jury / User"] -->|Interacts with UI| Vercel["🚀 Vercel Frontend (React + Tailwind)"]
    Vercel -->|HTTP GET /api/test/events| API1["🌐 Render72 API: List Endpoint"][cite: 11]
    Vercel -->|HTTP GET /api/test/events/{id}| API2["🌐 Render72 API: Detail Endpoint"][cite: 4]
    API1 -->|Returns 30 Event Summaries| Vercel[cite: 11, 12]
    API2 -->|Returns Full Schema (Schedules, Prizes, FAQs)| Vercel[cite: 4]
    Vercel -->|Renders Interactive Dashboard| User
🔄 User Journey & Event Exploration FlowCode snippetsequenceDiagram
    autonumber
    actor Judge as Jury Member
    participant App as React Frontend
    participant API as Render72 API (render72.pages.dev)[cite: 3, 11]

    Judge->>App: Opens Web Application
    App->>API: Fetch GET /api/test/events[cite: 11]
    API-->>App: Returns JSON Event Array[cite: 12]
    App->>Judge: Displays Search, Filters & Event Cards
    Judge->>App: Clicks an Event Card (e.g., CivicForge 24)[cite: 9]
    App->>API: Fetch GET /api/test/events/{id}[cite: 4]
    API-->>App: Returns Detailed Schema (Prizes, IST Schedules, Contacts)[cite: 4]
    App->>Judge: Renders Immersive Deep-Dive Modal with Full Specs
💡 Core Technical FeaturesZero-Latency Client-Side Filtering: Instant search across event titles, categories, tags, and technical/cultural flags.   Dynamic Detail Views: Seamlessly fetches deep-dive payloads (/api/test/events/{id}) displaying complete IST session schedules, prize tiers in INR, and coordinator contact info.   Immersive Design System: Built with custom Tailwind CSS glassmorphism, micro-animations, responsive grid layouts, and loading skeleton states.Production Resilience: Engineered with robust error boundaries and fallback handlers to guarantee zero crashes during live jury walkthroughs.🛠️ Tech StackFrontend Framework: React 18, ViteStyling & UI: Tailwind CSS, Lucide Icons, Framer MotionData Fetching: Native Async Fetch with custom caching hooksDeployment: Vercel (Global Edge Network)⚙️ Local Development SetupClone the repository:Bashgit clone [https://github.com/your-username/render72-event-command-center.git](https://github.com/your-username/render72-event-command-center.git)
cd render72-event-command-center
Install dependencies:Bashnpm install
Configure environment variables:Create a .env file in the root directory:Code snippetVITE_API_URL=[https://render72.pages.dev](https://render72.pages.dev)
Run the local development server:Bashnpm run dev
Build for production:Bashnpm run build
🏆 Jury Evaluation Rubric MappingEvaluation PillarImplementation Strategy in CodeUI/UX PolishCustom dark-mode aesthetic, interactive card hovers, skeleton loaders, and intuitive typography.Technical ArchitectureModular component separation (/components, /services), clean async state handling, and zero memory leaks.Functionality100% adherence to Render72 API endpoints supporting both summary listing and deep-dive modal rendering.   Deployment ReliabilityFully configured with vercel.json routing and optimized asset bundles for instant zero-downtime delivery.Crafted with precision by sepas1609 from Team Runtime Slayers for Render72.
