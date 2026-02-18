# Task Manager Web App

Full-stack task manager built with React, Node.js/Express, and MongoDB Atlas.

## Features
- User registration and login (JWT authentication)
- Create, update, delete tasks
- Due dates and priority levels
- Track task status (To Do, In Progress, Done)
- Visual progress chart of task statuses

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

By default, the frontend expects the backend at http://localhost:3000.