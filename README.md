# ERASMuse

A multilingual AI assistant for Erasmus students, tourists, and locals in Ruse, Bulgaria.

Live: [erasmuse.vercel.app](https://erasmuse.vercel.app)

---

## Features

- AI assistant in multiple languages
- Explore events, hidden gems, and interactive map
- Campus info, facilities, and first-week checklist
- Transport routes and travel tips
- Document analyzer for contracts and official papers
- Find a buddy — connect with other students
- Dark / light mode
- Emergency contacts button

---

## Tech Stack

- React + TypeScript
- Tailwind CSS
- React Router v6
- Vite
- i18next
- Sirma AI / Gemini via Supabase Edge Functions
- Vercel

---

## Setup

```bash
git clone https://github.com/Huseyn005/erasmuse-web-studio.git
cd erasmuse-web-studio
npm install
npm run dev
```

Runs at `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SIRMA_API_KEY=your_key
VITE_SIRMA_AGENT_ID=your_agent_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Deployment

Connected to Vercel via GitHub. Every push to `main` deploys automatically.

To build locally:

```bash
npm run build
```

A `vercel.json` is included at the root for SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## License

MIT
