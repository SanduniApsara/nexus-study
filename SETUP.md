# 🚀 SETUP GUIDE — Nexus Study

Follow these steps exactly in Anaconda Prompt.

## STEP 1 — Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Install with default settings. MongoDB runs on port 27017 by default.

## STEP 2 — Setup the Backend (Server)

```bash
conda activate expense_tracker
cd C:\Users\Hi\PycharmProjects\nexus-study\server
npm install
```

Create your .env file (copy from .env.example):
```bash
copy .env.example .env
```

Start the backend server:
```bash
npm run dev
```

You should see:
  ✅ MongoDB connected
  🚀 Server running on http://localhost:5000

## STEP 3 — Setup the Frontend (Client)
Open a NEW Anaconda Prompt tab/window:

```bash
conda activate expense_tracker
cd C:\Users\Hi\PycharmProjects\nexus-study\client
npm install
npm run dev
```

You should see:
  ➜  Local:   http://localhost:5173

## STEP 4 — Open in browser
Go to: http://localhost:5173

Register a new account and start using the app!

---

## Running in PyCharm

You can also run both servers from PyCharm terminal tabs:

Tab 1 (Backend):
  cd server
  npm run dev

Tab 2 (Frontend):
  cd client
  npm run dev

---

## Push to GitHub

```bash
cd C:\Users\Hi\PycharmProjects\nexus-study
git init
git add .
git commit -m "feat: full stack student study planner & GPA tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-study.git
git push -u origin main
```

---

## What to write on your CV

Project: Nexus Study — Student GPA & Study Planner
Tech:    React 18, Vite, Tailwind CSS, Zustand, Node.js, Express.js, MongoDB, REST API, JWT Auth
Link:    https://github.com/YOUR_USERNAME/nexus-study
