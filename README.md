# Quiz Platform

A full-stack quiz platform with admin exam management and public exam-taking. Built with Express, MongoDB, React, and TailwindCSS.

## Architecture

```
Quiz App/
├── backend/          # Express API server
│   ├── models/       # Mongoose models (Admin, Exam, Question, Attempt)
│   ├── routes/       # API route handlers
│   ├── middleware/    # Auth, validation, error handling
│   └── scripts/      # Seed scripts
└── frontend/         # React (Vite) client
    └── src/
        ├── components/   # Shared components
        ├── pages/        # Route pages (admin/ and public/)
        ├── store/        # Zustand state stores
        └── lib/          # Axios instance
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### 1. Environment Variables

Copy the example env file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

| Variable      | Description                     | Default                                  |
|---------------|---------------------------------|------------------------------------------|
| MONGODB_URI   | MongoDB connection string       | mongodb://localhost:27017/quiz-platform   |
| JWT_SECRET    | Secret key for JWT signing      | (change this)                            |
| PORT          | Backend server port             | 5000                                     |
| CLIENT_URL    | Frontend URL (for CORS)         | http://localhost:5173                     |

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Seed Admin User

```bash
cd backend
npm run seed:admin
```

This creates the admin account:
- Email: `hamzamirza9084@gmail.com`
- Password: `Surge@123`

The script is idempotent — safe to run multiple times.

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## API Routes

### Auth
| Method | Endpoint            | Description          | Auth     |
|--------|---------------------|----------------------|----------|
| POST   | /api/admin/login    | Admin login → JWT    | None     |

### Admin (JWT Required)
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | /api/admin/exams                  | Create exam                    |
| GET    | /api/admin/exams                  | List all exams                 |
| GET    | /api/admin/exams/:id              | Get exam with questions        |
| PUT    | /api/admin/exams/:id              | Update exam metadata           |
| PATCH  | /api/admin/exams/:id/visibility   | Toggle visibility              |
| DELETE | /api/admin/exams/:id              | Delete exam (cascade)          |
| POST   | /api/admin/exams/:id/questions    | Add question                   |
| PUT    | /api/admin/questions/:id          | Edit question                  |
| DELETE | /api/admin/questions/:id          | Delete question                |
| GET    | /api/admin/exams/:id/attempts     | List exam attempts             |

### Public (No Auth)
| Method | Endpoint                 | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | /api/exams               | List visible exams                       |
| GET    | /api/exams/:id/start     | Start exam (query: userName)             |
| POST   | /api/exams/:id/submit    | Submit answers, get scored results       |

## Frontend Routes

| Path                       | Description              |
|----------------------------|--------------------------|
| /                          | Landing — visible exams  |
| /exam/:id/enter            | Name entry               |
| /exam/:id/take             | Active exam with timer   |
| /exam/:id/results          | Score & answer review    |
| /admin/login               | Admin login              |
| /admin/dashboard           | Exam management          |
| /admin/exams/:id           | Question builder         |
| /admin/exams/:id/attempts  | Attempt history          |

## Key Features

- **Admin**: Create/edit/delete exams, add questions with 4 options, toggle visibility, view all attempts
- **User**: Browse visible exams, enter name, take timed exam, auto-submit on timer expiry, review results
- **Security**: JWT auth, bcrypt hashing, express-validator, server-side timer enforcement
- **UX**: Monochrome dark theme, mobile-responsive, confirmation modals, question navigation
