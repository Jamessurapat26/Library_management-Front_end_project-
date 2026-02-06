# Library Management System (ระบบจัดการห้องสมุด)

A front-end library management system built with **Next.js 15**, **React 19**, and **TypeScript**. The application uses mock data to simulate a full library workflow — book catalog, member management, borrow/return transactions, reports, and role-based access control — all with Thai/English bilingual support and dark mode.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15.5](https://nextjs.org) (App Router, Turbopack) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | Geist Sans + Geist Mono (via `next/font`) |
| Testing | Jest + React Testing Library (configured, tests pending) |

## Features

### Core Modules

- **Book Catalog** — Browse, search, filter by category/availability/year/author, paginated grid view, add/edit/delete books with copy-level tracking
- **Member Management** — CRUD operations for members, role assignment, status toggling (active/inactive), form validation with duplicate detection
- **Borrow/Return** — Borrow books with member search, configurable loan period, auto-due-date calculation, return processing, loan extensions, overdue detection
- **Transactions** — Full transaction history with filtering by status/type/date range, real-time overdue checking
- **Reports** — Overview stats, popular books, active borrowers, books/members/transactions breakdowns
- **Dashboard** — Quick stats cards, recent activities, quick actions, system announcements

### System Features

- **Authentication** — Session-based auth with localStorage persistence, "Remember Me" (30-day session), periodic session validation, expiry warnings, auto-logout
- **Role-Based Access Control** — Three roles with permission matrix:
  - **Admin** — Full access: manage all users, create librarian/admin accounts
  - **Librarian** — Operational access: manage members and books, create member accounts only
  - **Member** — No admin access (cannot log in to the management system)
- **Internationalization (i18n)** — Thai (default) and English, togglable at runtime
- **Dark Mode** — Light/dark theme with CSS variables, persisted to localStorage
- **Toast Notifications** — Success/error/info toasts with auto-dismiss
- **Protected Routes** — Auth guard with role checking and session error handling
- **Responsive Layout** — Collapsible sidebar, responsive grid, mobile-friendly

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or later
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/Jamessurapat26/Library_management-Front_end_project-.git
cd Library_management-Front_end_project-
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Test Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Librarian | `librarian1_lib` | `lib123456` |
| Librarian | `librarian2_lib` | `lib789012` |

> **Note:** This is a front-end-only project. All data is mock data stored in memory — no backend or database is involved. Data resets on page refresh.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Theme > Language > Toast > Auth providers)
│   ├── page.tsx                  # Public landing page
│   ├── not-found.tsx             # Custom 404
│   ├── globals.css               # Global styles + dark mode variables
│   ├── auth/login/               # Login page
│   ├── dashboard/                # Dashboard + components
│   ├── books/                    # Book catalog, detail, add + components
│   ├── members/                  # Member management + components
│   ├── transactions/             # Borrow/return management + components
│   ├── reports/                  # Reports & analytics + components
│   └── setting/                  # Theme & language settings
├── components/                   # Shared components
│   ├── Layout.tsx                # DashboardLayout (Navbar + Sidebar + Footer)
│   ├── Navbar.tsx                # Top navigation bar
│   ├── Sidebar.tsx               # Collapsible sidebar with role-based menu
│   ├── ProtectedRoute.tsx        # Auth guard HOC
│   ├── SessionStatus.tsx         # Session expiry display
│   └── Toast.tsx                 # Toast notification component
├── context/                      # React Context providers
│   ├── AuthContext.tsx            # Authentication & session state
│   ├── ThemeContext.tsx           # Light/dark theme
│   ├── LanguageContext.tsx        # Thai/English i18n with t() function
│   └── ToastContext.tsx           # Toast notification queue
├── hooks/                        # Custom hooks
│   ├── useAuth.ts                # Enhanced auth (error handling, session refresh)
│   ├── useRolePermissions.ts     # Role-based permission matrix
│   ├── useTheme.ts               # Theme context consumer
│   ├── useLanguage.ts            # Language context consumer
│   ├── useSidebarCollapse.ts     # Sidebar state persistence
│   └── useMemberFormValidation.ts # Member form validation (debounced)
├── mock/                         # Mock data layer
│   ├── books.ts                  # 6 books with copy-level tracking
│   ├── members.ts                # 6 members (admin, librarians, members)
│   ├── users.ts                  # 3 login accounts
│   ├── transactions.ts           # 5 sample transactions
│   └── userMemberMapping.ts      # User-member CRUD helpers
├── types/
│   └── index.ts                  # All shared TypeScript types
├── constants/
│   └── index.ts                  # All shared constants & magic values
└── utils/
    ├── auth.ts                   # Session management utilities
    └── memberValidation.ts       # Field-level validation rules
```

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/auth/login` | Public | Login form |
| `/dashboard` | Protected | Dashboard with stats & quick actions |
| `/books` | Protected | Book catalog with search & filter |
| `/books/add` | Protected | Add new book form |
| `/books/[id]` | Protected | Book detail page |
| `/members` | Protected | Member management |
| `/transactions` | Protected | Borrow/return transactions |
| `/reports` | Protected | Reports & analytics |
| `/setting` | Protected | Theme & language settings |

## Architecture Decisions

- **No backend** — All data lives in mock arrays (`src/mock/`). Mutations are performed directly on these arrays with `forceUpdate` counters to trigger re-renders. This is intentional for a front-end-only prototype.
- **Single source of truth for types** — All shared TypeScript interfaces and union types are defined in `src/types/index.ts`. Component-local duplicates have been removed.
- **Single source of truth for constants** — All magic values (localStorage keys, session durations, polling intervals, display label maps, etc.) are centralized in `src/constants/index.ts`.
- **i18n without external libraries** — Translation dictionaries are embedded in `LanguageContext.tsx` with a simple `t(key)` lookup function. Some hardcoded Thai strings remain and are planned for migration to the translation system in a future phase.
- **Session management** — Client-side sessions stored in `localStorage` with configurable expiry, periodic validation, and countdown warnings.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build with Turbopack |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |

## License

This project is for educational purposes.
