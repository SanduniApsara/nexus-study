# 🎓 Nexus Study — Student GPA & Study Planner

> A full-stack web application for university students to manage modules, track GPA, schedule study sessions, and manage assignments with real-time analytics.

🔗 **[Live Demo](https://YOUR_USERNAME.github.io/nexus-study)** &nbsp;|&nbsp; 📁 **[Source Code](https://github.com/YOUR_USERNAME/nexus-study)**

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | Register & login with JWT token security |
| 📚 Module Manager | Add subjects with credits, icons & color coding |
| 📊 GPA Calculator | Auto calculates GPA live using weighted average |
| ✅ Task Manager | Assignments with priority, deadline & status tracking |
| 📅 Study Planner | Log study sessions with duration & productivity rating |
| 📈 Analytics | 5 chart types — Bar, Line, Radar, Pie, Heatmap |
| 🎯 Goal Tracker | Set target GPA and track progress visually |
| 🔔 Deadline Alerts | Overdue and upcoming task warnings |
| 📱 Responsive | Fully mobile-friendly with sidebar navigation |
| ☁️ Cloud Database | All data saved to MongoDB permanently |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **API** | RESTful API |

---

## 📁 Project Structure

```
nexus-study/
│
├── server/                        ← Node.js + Express Backend
│   ├── server.js                  ← Entry point
│   ├── .env.example               ← Environment variables template
│   ├── middleware/
│   │   └── auth.js                ← JWT authentication middleware
│   ├── models/
│   │   ├── User.js                ← User schema (Mongoose)
│   │   ├── Module.js              ← Module schema with GPA calculation
│   │   ├── Task.js                ← Task schema with overdue virtual
│   │   └── Session.js             ← Study session schema
│   ├── controllers/
│   │   ├── authController.js      ← Register, Login, Profile
│   │   ├── moduleController.js    ← CRUD + grade management
│   │   ├── taskController.js      ← CRUD + filtering
│   │   ├── sessionController.js   ← CRUD
│   │   └── statsController.js     ← GPA engine & analytics
│   └── routes/
│       ├── auth.js
│       ├── modules.js
│       ├── tasks.js
│       ├── sessions.js
│       └── stats.js
│
└── client/                        ← React + Vite Frontend
    └── src/
        ├── App.jsx                ← React Router v6 setup
        ├── services/
        │   └── api.js             ← Axios + JWT interceptor
        ├── store/
        │   ├── useAuthStore.js    ← Zustand auth state
        │   └── useAppStore.js     ← Zustand app state
        ├── components/
        │   ├── Layout.jsx         ← Sidebar + topbar
        │   ├── Modal.jsx          ← Reusable modal
        │   ├── KPICard.jsx        ← Reusable stat card
        │   └── Toast.jsx          ← Notifications
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx      ← GPA radial + charts
            ├── Modules.jsx        ← Grade management
            ├── Tasks.jsx          ← Priority task manager
            ├── Planner.jsx        ← Study session logger
            ├── Analytics.jsx      ← 5 Recharts charts
            └── Profile.jsx
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| GET | `/api/modules` | Get all modules | ✅ |
| POST | `/api/modules` | Create module | ✅ |
| PUT | `/api/modules/:id` | Update module | ✅ |
| DELETE | `/api/modules/:id` | Delete module | ✅ |
| POST | `/api/modules/:id/grades` | Add grade | ✅ |
| GET | `/api/tasks` | Get all tasks | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| GET | `/api/sessions` | Get study sessions | ✅ |
| POST | `/api/sessions` | Log session | ✅ |
| GET | `/api/stats` | Get GPA & analytics | ✅ |

---

## 📸 Screenshots

> Add screenshots of your running app here
> Take screenshots and paste them directly into GitHub README editor

---

## 🚀 Run Locally

### Prerequisites
- Node.js — https://nodejs.org
- MongoDB — https://www.mongodb.com/try/download/community

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nexus-study.git
cd nexus-study
```

### Step 2 — Setup Backend
```bash
cd server
npm install
copy .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexus_study
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

```bash
npm run dev
```

### Step 3 — Setup Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### Step 4 — Open in browser
```
http://localhost:5173
```

---

## 📊 Database Schema

```
User        → has many Modules, Tasks, Sessions
Module      → belongs to User, has many Grades
Task        → belongs to User, belongs to Module (optional)
Session     → belongs to User, belongs to Module (optional)
```

---

## 👩‍💻 Author

**Sanduni Apsara**
- 🎓 Undergraduate — Computer Science
- 🔗 GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- 💼 LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

> ⭐ If you found this project helpful, please give it a star!
