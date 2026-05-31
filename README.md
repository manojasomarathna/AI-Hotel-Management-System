# 🏨 AI Hotel Management System

A full-stack AI-powered hotel management system built with React, FastAPI, PostgreSQL, and OpenAI.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Recharts, Axios |
| Backend | Python 3.11, FastAPI, SQLAlchemy |
| Database | PostgreSQL 16 |
| AI | OpenAI GPT-3.5, Tesseract OCR |
| Auth | JWT (JSON Web Tokens) |
| Deploy | Docker, Docker Compose |

## 🧩 Features

- **Authentication** — JWT login/register with Admin & Staff roles
- **Dashboard** — Revenue, bookings, expenses summary with charts
- **Employee Management** — CRUD, attendance tracking, leave management
- **Inventory System** — Stock management with low-stock alerts
- **Booking System** — Room bookings with availability tracking
- **Invoice System** — PDF invoice generation & download
- **AI Chatbot** — Ask questions about hotel data in natural language
- **AI Report Summary** — Auto-generated performance insights
- **AI Sales Prediction** — Next month forecast based on history
- **AI Invoice Reader** — Upload invoice image → extract data via OCR + AI

## 📁 Project Structure

```
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, AIChatbot, ...
│   │   ├── components/     # Sidebar, ...
│   │   ├── context/        # AuthContext
│   │   └── services/       # Axios API client
│   └── Dockerfile
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── routers/        # auth, dashboard, employees, inventory, bookings, invoices, ai
│   │   ├── models/         # SQLAlchemy models
│   │   ├── services/       # auth_service (JWT)
│   │   ├── main.py
│   │   ├── database.py
│   │   └── config.py
│   ├── requirements.txt
│   └── Dockerfile
├── database/
│   └── init.sql            # Schema + seed data
├── docker-compose.yml
└── README.md
```

## ⚡ Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd "AI Hotel Management System"

# 2. Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY

# 3. Run everything
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # Add your keys
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🔑 Default Login

| Email | Password | Role |
|-------|----------|------|
| admin@hotel.com | admin123 | Admin |

## 🤖 AI Features Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard/summary` | Dashboard stats |
| GET/POST | `/api/employees/` | Employee CRUD |
| GET/POST | `/api/inventory/` | Inventory CRUD |
| GET | `/api/inventory/low-stock` | Low stock alerts |
| GET/POST | `/api/bookings/` | Booking CRUD |
| GET/POST | `/api/invoices/` | Invoice CRUD |
| GET | `/api/invoices/{id}/pdf` | Download PDF |
| POST | `/api/ai/chat` | AI Chatbot |
| GET | `/api/ai/report-summary` | AI Summary |
| GET | `/api/ai/sales-prediction` | AI Prediction |
| POST | `/api/ai/invoice-reader` | OCR Invoice Reader |

## 🗺️ Development Phases

- [x] Phase 1 — Project structure & base setup
- [x] Phase 2 — CRUD APIs (employees, inventory, bookings, invoices)
- [x] Phase 3 — JWT Authentication & role-based access
- [x] Phase 4 — AI Integration (chatbot, summary, prediction, OCR)
- [ ] Phase 5 — Deploy to VPS / Railway / Render

## 📄 License

MIT
