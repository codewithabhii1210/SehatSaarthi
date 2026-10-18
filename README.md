# SehatSaarthi

**Accessible Healthcare for Every Citizen** — a full-stack healthcare platform built for **SIH 2026**.

SehatSaarthi connects patients, doctors, ASHA health workers and government administrators on one platform, so that basic healthcare coordination — appointments, referrals, immunization records, lab orders and prescriptions — works through a single web application instead of paper.

> 🏆 Built for **Smart India Hackathon 2026**

---

## ✨ Features

### Role-based dashboards
Four separate interfaces, each with its own navigation and permissions:

| Role | Capabilities |
|---|---|
| **Patient** | Book appointments, view lab reports, track referrals, immunization & maternal records, medicine history, treatment advisor |
| **Doctor** | Patient queue, consultations, prescriptions, lab orders, referrals, consultation history |
| **ASHA Health Worker** | Field visit requests, maternal checkups, triage data, assigned tasks |
| **Government / Admin** | Facility management, immunization oversight, platform analytics |

### Core modules
- **Authentication** — JWT-based signup/login with bcrypt password hashing and role-based middleware protecting every route.
- **Referral system** — create, assign and track patient referrals between facilities, with a live tracking panel.
- **Immunization & maternal care** — immunization schedules, maternal checkups and visit requests.
- **Lab orders & reports** — doctors place orders, labs update results, patients view reports.
- **Prescriptions** — digital prescription creation and patient history.
- **Gemini AI chatbot** — AI-driven healthcare assistance and follow-up suggestions powered by the Google Gemini API.
- **Multi-language support** — i18next integration for regional language accessibility.
- **Real-time updates** — Socket.io for live notifications, with a graceful no-op fallback on serverless deploys.

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- React i18next (multi-language)
- Socket.io-client

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (`jsonwebtoken` + `bcryptjs`)
- Helmet (security headers), CORS, express-validator
- Socket.io
- Google Gemini API (AI assistance)

**Deployment**
- Frontend + API on Vercel (`vercel.json`)
- MongoDB Atlas / local MongoDB

---

## 📁 Project Structure

```
sehatsaarthi/
├── api/                  # Serverless entry point
├── backend/
│   └── src/
│       ├── config/       # DB connection
│       ├── controllers/  # auth, patient, doctor, healthWorker, admin,
│       │                 # immunization, referral, lab, keepAlive
│       ├── middleware/   # auth, role, caching
│       ├── models/       # User, PatientProfile, Appointment, Referral,
│       │                 # Immunization, Prescription, LabOrder, AshaTask,
│       │                 # MaternalCheckup, TriageData, Facility, VisitRequest
│       ├── routes/       # auth, patient, doctor, healthWorker, admin,
│       │                 # immunization, referral, treatment, chatbot
│       └── utils/        # error handler
├── frontend/
│   └── src/
│       ├── components/   # GeminiChatbot, ReferralTrackingPanel, navbars...
│       ├── pages/        # patient, doctor, health-worker, government, auth
│       └── routes/       # AppRoutes, ProtectedRoute
├── DEMO_DATASET.txt
└── vite.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local instance or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/codewithabhii1210/SehatSaarthi.git
cd SehatSaarthi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sehatsarthi
JWT_SECRET=your_jwt_secret_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Seed demo data (optional)

```bash
npm run seed
```

### 5. Run in development

```bash
# backend
npm run dev:server

# frontend (separate terminal)
npm run dev
```

### 6. Production build

```bash
npm run build
npm start
```

---

## 🔌 API Overview

Base route: `/api`

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in, returns JWT |
| `GET` | `/api/health` | Service health check |
| `*` | `/api/patient/*` | Patient records, lab reports, medicine history |
| `*` | `/api/doctor/*` | Queue, prescriptions, lab orders, referrals |
| `*` | `/api/health-worker/*` | Visits, checkups, tasks |
| `*` | `/api/admin/*` | Facilities, immunization, analytics |
| `*` | `/api/immunization/*` | Immunization schedules & records |
| `*` | `/api/referral/*` | Create and track referrals |
| `*` | `/api/chatbot/*` | Gemini AI assistant |

All protected routes require an `Authorization: Bearer <token>` header.

---

## 🔒 Security

- **Helmet** for secure HTTP headers
- **bcryptjs** password hashing
- **JWT** with expiry, passed via Authorization header
- **Role-based middleware** — routes are gated by user role
- **express-validator** for request validation
- **CORS** restricted via `ALLOWED_ORIGIN`

---

## 🗺 Roadmap

- [ ] Offline-first support for low-connectivity areas
- [ ] SMS reminders for appointments and immunization
- [ ] Admin analytics dashboard with charts
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Abhishek Singh**
- Portfolio: [abhishekprotfolio.vercel.app](https://abhishekprotfolio.vercel.app)
- GitHub: [@codewithabhii1210](https://github.com/codewithabhii1210)
- LinkedIn: [abhisheksingh1210](https://www.linkedin.com/in/abhisheksingh1210)

---

## 📄 License

This project was developed for Smart India Hackathon 2026.
