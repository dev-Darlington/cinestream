![Next.js](https://img.shields.io/badge/Next.js-16-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38bdf8)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

# 🎬 CineStream

CineStream is a modern, responsive movie discovery web app built with Next.js, TypeScript, and Tailwind CSS, powered by live data from The Movie Database (TMDB) API.

It focuses on performance, clean UI, and delightful micro-interactions — delivering a cinematic browsing experience right in the browser.

# ✨ Features

- 🖥️ Immersive Theater Video Player
Custom HTML5 controls supporting play/pause, seeking timeline, volume slider, playback speeds (0.5x to 2x), resolution selector (1080p, 720p, 480p) with buffering transitions, synced subtitle tracks, fullscreen, and hotkey controls.

- 📥 Offline Download Manager
Sleek floating side-drawer managing active background downloads (progress bars, speed MB/s, ETA, pause/cancel options) and completed downloads, stored locally for persistent offline viewing.

- 🔌 Offline Mode Simulator
A togglable system testing completely offline operations. When active, it displays warning headers and blocks catalog requests with a custom offline prompt, while allowing users to play downloads offline.

- 🎨 Premium Brand Identity
A new "Midnight Steel & Neon Turquoise" aesthetic featuring Google Fonts Outfit (headings) and Plus Jakarta Sans (body), a custom glowing SVG logo icon, and animated heart-pop favorite toggles.

- 🔍 Modern Search Bar
A search bar featuring glassmorphic designs, keyboard shortcuts (Ctrl+K and /), clear/loading icons, arrow keys keyboard navigation, click-outside closures, and rich result dropdown with poster thumbnails and metadata ratings.

- 🎥 Trending Movies Dashboard
Discover what’s trending this week with a visually rich, responsive grid.

- 🌟 Hero Banner
A featured movie section with cinematic styling and direct watch streaming links.

- ❤️ Favorites System
Save and manage favorite movies using local storage (no auth required) with modern heart icons.

- 🧭 Genre Browsing
Explore movies by genre with dynamic TMDB-powered filtering.

- ⚡ Server-Side Rendering (SSR)
Fast initial load and SEO-friendly pages using Next.js Pages Router.

- 📱 Fully Responsive
Optimized for mobile, tablet, and desktop screens.

# 🛠 Tech Stack

- Framework: Next.js (Pages Router)

- Language: TypeScript

- Styling: Tailwind CSS (latest)

- Data Source: TMDB API

- State Management: React Context

- Image Optimization: next/image with remotePatterns

- Deployment: Vercel

# 📸 Screenshots
![Home Page](./screenshots/homepage.png)
![Favorites Page](./screenshots/favorites.png)
![Genres Page](./screenshots/genres.png)
![Trending Movies Page](./screenshots/trending.png)

# 🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/dev-Darlington/cinestream.git
```bash
cd cinestream
```

2️⃣ Install dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
```

3️⃣ Environment Variables

Create a .env.local file in the root directory:

TMDB_API_KEY=your_tmdb_api_key_here


You can get an API key from:
https://www.themoviedb.org/settings/api

4️⃣ Run the development server
```bash
pnpm run dev
```

Open http://localhost:3000
 to view the app.

 5️⃣ Build for production
 ```bash
pnpm run build
pnpm run start
```

## 📂 Project Structure

```md
```bash
cinestream/
├── components/
│   ├── section/        # Page-level sections (HeroBanner, dashboards)
│   └── ui/             # Reusable UI components (MovieCard, buttons)
├── contexts/           # Global state (FavoritesContext)
├── lib/                # External API and data-fetching logic (TMDB)
├── pages/              # Next.js Pages Router (routes & SSR)
├── styles/             # Global styles, themes, and Tailwind setup
├── types/              # TypeScript interfaces and models
├── public/             # Static assets (images, icons)
└── next.config.js      # Next.js configuration
```

## 🧠 Architectural Notes

- No authentication by design — favorites are client-side only

- Defensive API fetching to prevent SSR crashes

- Empty states instead of runtime failures

- Strict TypeScript typing with runtime safety

- No unnecessary animation libraries (performance-first)

## 🌱 Future Improvements

- 🧩 Skeleton loaders for better perceived performance

- 🎭 Page transitions

- 🔐 Optional user authentication

- 📊 Recommendations based on favorites

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo

2. Create a feature branch

3. Commit your changes

4. Open a pull request

## 📜 License

This project is open-source and available under the MIT License.

👋 Author

Darlington Nwanne
Software Developer

- GitHub: @dev-Darlington

- LinkedIn: https://www.linkedin.com/in/darlington-uc

