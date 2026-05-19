# PathFinder

**AI-powered university discovery and application guidance platform**

**Live:** https://pathfinder-cdip-project.vercel.app

---

## Overview

PathFinder helps students navigate the university application process end-to-end — from discovering universities that match their profile, to tracking applications, exploring scholarships, preparing with AI tools, and booking expert consultations. The platform runs entirely on mock data and is fully functional as a frontend demo.

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, React Router 7                        |
| Styling     | Tailwind CSS 3.4, custom CSS design tokens      |
| Charts      | Recharts                                        |
| Icons       | Lucide React                                    |
| Auth / DB   | Firebase (wired, mock data active in frontend)  |
| Backend     | Node.js / Express (server/ directory)           |
| Deployment  | Vercel (frontend)                               |
| Fonts       | Inter (body) · Poppins (headings) via Google Fonts |

---

## Features

### University Discovery
- Search and filter universities by country, ranking, tuition range, acceptance rate, and major
- **Fit Score** — color-coded compatibility badge (Great / Good / Low) based on profile match
- **Acceptance rate color coding** — red < 15%, amber 15–40%, green > 40%
- **Side-by-side comparison** — select 2–3 universities, sticky bottom bar opens a comparison modal with rank, tuition, acceptance rate, fit score, and top majors
- University detail pages with overview, academics, admissions, financials, and a Coming Soon application CTA

### Dashboard
- Shortlisted university cards with status tracking (Not Started → In Progress → Submitted → Accepted)
- Live mock updates every 10 seconds — new cards animate in with a green ring
- Application pipeline progress bars broken down by status
- Stats row: shortlisted count, active applications, average fit score, accepted offers
- Quick links to AI Tools, Resources, Consultation, and Notifications

### Scholarships
- Scholarship cards with award amount, country, provider, eligibility, and deadline countdown
- Urgent (≤ 14 days) / warning (≤ 30 days) / normal deadline states
- Smart Match badges for scholarships matching the user's profile
- Expired scholarships are visually dimmed, non-interactive, and stripped of the Apply button

### AI Tools (AIBrainstorm)
- Chat interface for AI-assisted SOP brainstorming, essay ideas, and application strategy
- Full markdown rendering — bold, italic, numbered lists, bullet lists, headings

### Resource Library
- Categorized study resources: IELTS, TOEFL, SAT, GRE, Essays, Visa
- Embedded **Study Pal** chat widget with markdown rendering
- Resource cards with type badges and external links

### Analytics
- Personal analytics dashboard: fit score trends, application pipeline pie chart, resource activity bar chart, preparation readiness line chart
- Empty state with feature preview for new users with no shortlisted universities

### Profile
- Edit personal info, academic background, test scores, preferred countries and majors
- Input validation: GPA (0–4.0), IELTS (0–9), TOEFL (0–120), SAT (400–1600) with inline error messages

### Notifications
- Dropdown panel in the navbar with live mock drip-feed every 25 seconds
- Closes on Escape key or outside click
- Full notifications page with read/unread filtering, grouped by Today / Yesterday / Earlier
- Full-page notifications at `/notifications`

### Consultation & Payment
- Book expert consultation sessions
- Stripe-style payment flow for premium upgrade

### Admin
- Admin dashboard for managing university data, scholarships, resources, and users

---

## Design System

- **Brand colors:** `#4F46E5` → `#6366F1` (indigo-violet)
- **Dark mode:** Tailwind `darkMode: 'class'`, toggled via `ThemeContext`, persisted in `localStorage`, FOUC-free via inline `<script>` in `<head>`
- **Global component classes:** `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.stat-card`, `.glass`, `.gradient-text`, `.brand-gradient`, `.nav-link`, `.section-label`
- **Animations:** `animate-pop`, `animate-slide-up`, `animate-slide-down`, `animate-fade-in`
- **Toasts:** `ToastContext` / `useToast()` / `addToast(message, type)` available app-wide

---

## Project Structure

```
pathfinder/
├── client/                        # React frontend
│   ├── public/
│   │   ├── index.html             # Inline SVG compass favicon, FOUC script
│   │   ├── favicon.svg            # Compass icon (indigo gradient)
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky nav, hamburger, dark mode toggle
│   │   │   ├── Layout.jsx         # App shell with Navbar, footer, CompareBar
│   │   │   ├── UniversityCard.jsx # Card with fit score, shortlist, compare toggle
│   │   │   ├── CompareBar.jsx     # Sticky compare bar + comparison modal
│   │   │   ├── Notifications.jsx  # Dropdown panel with live drip-feed
│   │   │   ├── FitScoreBadge.jsx  # 3-tier color-coded fit score badge
│   │   │   ├── MarkdownMessage.jsx # Shared markdown renderer for AI chats
│   │   │   └── ComingSoonModal.jsx # Modal for unimplemented routes
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Firebase auth + mock user
│   │   │   ├── ThemeContext.js    # Dark/light mode with localStorage persistence
│   │   │   ├── CompareContext.jsx # University comparison state (max 3)
│   │   │   └── ToastContext.jsx   # Global toast notifications
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Application tracker, live updates
│   │   │   ├── Search.jsx         # University search with filters
│   │   │   ├── UniversityDetails.jsx
│   │   │   ├── ScholarshipSearch.jsx
│   │   │   ├── AIBrainstorm.jsx   # AI chat with markdown
│   │   │   ├── ResourceLibrary.jsx # Resources + Study Pal chat
│   │   │   ├── Analytics.jsx      # Charts, empty state for new users
│   │   │   ├── Profile.jsx        # Profile editor with validation
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── Consultation.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── mockData.js        # All mock universities, scholarships, notifications
│   │   │   └── api.js             # Axios client (REACT_APP_API_URL)
│   │   ├── App.js                 # Routes + provider tree
│   │   ├── index.css              # Design tokens, global component classes
│   │   └── tailwind.config.js
│   └── vercel.json                # SPA rewrites + CI=false build command
│
├── server/                        # Node.js / Express API
│   ├── models/                    # Mongoose models
│   ├── routes/                    # REST API routes
│   └── middleware/
│
└── functions/                     # Firebase Cloud Functions
```

---

## Running Locally

```bash
# Frontend
cd client
npm install
npm start          # http://localhost:3000

# Backend (optional — frontend works fully on mock data)
cd server
npm install
npm start          # http://localhost:5000
```

Set `REACT_APP_API_URL=http://localhost:5000` in `client/.env` to connect the frontend to the live backend.

---

## Deployment

Frontend is deployed on **Vercel**. To redeploy after changes:

```bash
cd client
vercel deploy --prod --yes
```

The `vercel.json` handles:
- `CI=false` build command (suppresses ESLint warnings as errors)
- SPA rewrites so all routes resolve to `index.html`

---

## Mock Data

All pages operate on mock data defined in `client/src/services/mockData.js`:

- **6 universities** — MIT, Oxford, Toronto, ETH Zurich, NUS, Melbourne
- **6 scholarships** — Chevening, Fulbright, Vanier, Australia Awards, DAAD, Gates Cambridge
- **Mock notifications** with types: Deadline, Scholarship, Application, System, Message
- **Mock shortlist** seeded to the dashboard for preview mode

The app detects whether a real user shortlist exists and falls back to mock data automatically.
