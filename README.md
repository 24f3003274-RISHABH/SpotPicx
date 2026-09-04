# SpotPicx — Local Discovery & Recommendation Platform

> **"Discover. Explore. Pick the Best."**
> SpotPicks is a scalable, data-driven local discovery and recommendation platform built for Delhi-NCR and architected for rapid expansion across major Indian metros.

## 🚀 Features

- **Data-Driven Architecture**: Dynamic rendering for categories, localities, and custom queries.
- **AI-Powered Natural Language Search**: Gemini-driven conversational query understanding.
- **Interactive Geospatial Mapping**: Supports Google Maps, OpenStreetMap, Mapbox, and canvas rendering.
- **Trust & Verification Layer**: Structured reviews, verified claims, moderation tools.
- **SEO & Dynamic Landing Engine**: Automated rankings, locality-category landing pages.
- **Multi-Role Portals**: Role-based access control with dedicated analytics.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) URI (or local MongoDB instance)

## 💻 How to Set Up from GitHub

1. **Clone the repository:**
   ```bash
   git clone https://github.com/spotpicx/SpotPicx.git
   cd SpotPicx
   ```

2. **Install Dependencies:**
   This project uses Bun as its package manager, but `npm` can also be used.
   ```bash
   bun install
   # or npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your details (especially `MONGODB_URI` and `GEMINI_API_KEY`).
   ```bash
   cp .env.example .env
   ```

## 🚀 How to Run

1. **Start the Development Server:**
   ```bash
   bun run dev
   # or npm run dev
   ```
   This single command spins up both the **Vite frontend** and the **Express backend**.
   
   - **Frontend Application:** `http://localhost:3000`
   - **API Health Check:** `http://localhost:3000/api/v1/health`

*(Note: The database will automatically seed with initial data on the first run.)*

## 🏗️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS v4, TanStack Query v5, Zustand.
- **Backend:** Node.js, Express, Mongoose 8+, JWT, Zod.
- **AI & Integrations:** Google Gen AI SDK (Gemini 3.7), Google Maps Platform API.

## 📚 Documentation & Roadmap

Detailed documentation regarding the architecture, API reference, security model, and phase-by-phase implementation roadmap has been moved to [ROADMAP.md](ROADMAP.md).

## 🧪 Testing

The project includes unit and integration tests powered by **Vitest** and **Supertest**.
```bash
npm test
```

## 🚀 Production Deployment

Brief steps for deployment:
1. **Database:** Set up MongoDB Atlas.
2. **Backend:** Deploy on Render/Railway using `npm run build` & `npm start`. Configure necessary environment variables.
3. **Frontend:** Deploy on Vercel with Vite preset. Set API URL and map provider keys.
4. **Media:** Use Cloudinary for handling image assets.

## 📄 License & Attribution

SpotPicks is open-source under the MIT License. Developed with precision craftsmanship for seamless local discovery across India.
