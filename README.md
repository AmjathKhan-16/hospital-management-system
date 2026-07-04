# Online Hospital Management System

Full-stack MERN application with role-based access for Admin, Doctor, and Patient.

## Tech
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, cors, morgan
- Frontend: React + Vite, React Router, Axios

## Folder Structure
```
backend/
  controllers/
  middleware/
  models/
  routes/
  server.js
frontend/
  src/
    components/
    pages/
    services/
    styles.css
  index.html
```

## Running Backend
```bash
cd backend
npm install
cp env.example .env   # create and set MONGO_URI and JWT_SECRET
npm run dev           # or npm start
```

## Running Frontend
```bash
cd frontend
npm install
npm run dev   # Vite dev server on http://localhost:3000
```

## API Highlights
- `POST /api/auth/register` { name, email, password, role, ... }
- `POST /api/auth/login`
- Protected routes with `Authorization: Bearer <token>`

## Default Roles & Flows
- Admin: manage doctors, patients, appointments, view stats.
- Doctor: view appointments, update status, add medical records.
- Patient: view profile, book appointments, view history and records.

## Notes
- Use MongoDB running locally or provide a connection string in `.env`.
- JWT secret should be set in `.env`.
