# StepOut — Find your next thing.

A production-quality event discovery platform built for Accra, Ghana.

Discover concerts, parties, sports events, food markets, tech meetups, workshops and
everything in between. Help organizers reach their audience with built-in ticketing,
QR code check-in and a real-time analytics dashboard.

---

## Features

### Discovery
- **Discover** hero with city-wide search
- Tonight · Trending · Picked for your vibe · Popular near you · This weekend
- Leaflet + OpenStreetMap interactive event map with marker popups
- Quick-view modal from any event card
- Global search overlay — events, organizers, venues, categories

### Events
- Filter by category, date window, area, price, distance, free-only
- Sort: recommended / most popular / newest / closest / price
- Load more pagination
- Shareable URL state (category, date, sort)
- Detailed event page: hero, schedule, map, organizer, related events

### Ticketing & checkout
- Multi-step checkout: pick tier → attendee details → payment → QR ticket
- GH₵ pricing throughout (Paystack integration ready)
- Digital ticket with scannable QR code
- Check-in scanner (paste or type ticket ID)

### Authentication
- Email + password sign-in and registration
- Interest onboarding (vibe picker)
- Demo accounts: `organizer@stepout.gh` / `admin@stepout.gh` (password: `stepout123`)

### Organizer dashboard (`/organizer`)
- Overview stats: events, views, interested, tickets sold, revenue
- Line, bar and pie charts (Recharts)
- My Events tab with status filter, duplicate, cancel
- 5-step Create Event wizard with live preview
- Attendee table with CSV export
- Check-in scanner page

### Admin dashboard (`/admin`)
- Platform stats
- Events table
- Users list
- Moderation queue: approve / reject pending events
- Report management

### UX
- Light and dark mode (system default, persisted)
- Mobile bottom navigation
- Responsive from 375 px to 1440+ px
- Toast notifications, skeleton loading, empty states, modals
- Framer Motion page transitions and card hover animations

---

## Tech stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tooling |
| Tailwind CSS 3 | Utility-first styling |
| React Router 6 | Client-side routing |
| Framer Motion | Animations and page transitions |
| Leaflet + React Leaflet | Interactive maps |
| Recharts | Dashboard charts |
| date-fns | Date formatting |
| qrcode.react | QR ticket generation |
| Axios | HTTP client (API-ready) |
| React Context | Global state |

---

## Project structure

```
stepout/
├── public/
│   └── favicon.png             StepOut pin mark
├── src/
│   ├── assets/
│   │   └── stepout-mark.png    Logo used in Navbar, tickets, etc.
│   ├── components/
│   │   ├── common/             Button, Input, Modal, Badge, Avatar, Toast…
│   │   ├── events/             EventCard, FilterPanel, EventMap, Checkout…
│   │   └── layout/             Navbar, Footer, MobileNav, DashboardShell…
│   ├── data/                   Demo catalogue (events, organizers, venues…)
│   ├── hooks/                  usePageMeta, useDebounced, useEventFilters
│   ├── pages/
│   │   ├── auth/               Login, Register, ForgotPassword, Interests
│   │   ├── discover/           Home / Discover
│   │   ├── events/             Events list, EventDetail, MapPage, Checkout
│   │   ├── organizer/          Overview, MyEvents, CreateEvent, Attendees, CheckIn
│   │   ├── admin/              AdminDashboard (moderation, events, users)
│   │   └── profile/            Profile, Saved
│   ├── services/               authService, eventService, ticketService…
│   ├── store/                  AppContext (global state)
│   ├── types/                  Shared TypeScript interfaces
│   └── utils/                  cn, format (GH₵, dates), storage, share, recommend
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Installation

```bash
# 1. Unzip the project
unzip stepout-frontend.zip
cd stepout

# 2. Install dependencies
npm install

# 3. Copy and configure environment
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app opens at **http://localhost:5173**.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the Django REST backend (`http://localhost:8000/api`) |
| `VITE_USE_API` | Set to `"true"` to route all service calls through the API |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key for live GH₵ payment processing |

Leave `VITE_USE_API` unset (or `"false"`) to run entirely on demo data from `src/data/`.

---

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Organizer | organizer@stepout.gh | stepout123 |
| Admin | admin@stepout.gh | stepout123 |

Sign up with any email to create an attendee account.

---

## Connecting the Django REST backend

Every service in `src/services/` follows the same pattern:

```ts
export const eventService = {
  async list() {
    if (useApi) return (await api.get<EventItem[]>('/events/')).data;
    return resolve(demoEvents); // <-- demo path
  },
  // ...
};
```

When `VITE_USE_API=true`:
- `eventService` → `GET /events/`, `POST /events/`, `PATCH /events/:id/`
- `authService` → `POST /auth/login/`, `POST /auth/register/`
- `ticketService` → `POST /tickets/`
- `organizerService` → `GET /organizers/:id/`

The demo data in `src/data/` doubles as the canonical schema for your DRF serializers.

---

## Deployment

```bash
npm run build   # outputs to dist/
```

`dist/` is a standard Vite SPA build — serve with Nginx, Vercel, Netlify or any static host.

For React Router to work on a non-root path, configure the host to rewrite all requests to `index.html`.

---

## Roadmap

- [ ] Paystack live payment integration
- [ ] Django REST Framework + PostgreSQL backend
- [ ] Real-time notifications via WebSockets
- [ ] Webcam QR scanning for check-in
- [ ] PWA / offline support
- [ ] Event recommendations via ML model on the backend
- [ ] Expanded city coverage (Kumasi, Cape Coast, Takoradi)
