# 🎵 VibeSync — AI-Powered Music Streaming Platform

<div align="center">

![VibeSync Banner](https://img.shields.io/badge/VibeSync-Music%20Platform-7c3aed?style=for-the-badge&logo=music&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vibesync--1--3ylv.onrender.com-00C7B7?style=for-the-badge&logo=render)](https://vibesync-1-3ylv.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-TiDB%20Cloud-4479A1?style=for-the-badge&logo=mysql)](https://tidbcloud.com)

> A full-stack music streaming web application with YouTube-powered full song playback, mood-based discovery, AI features, and an analytics dashboard.

</div>

---

## 🚀 Live Demo

👉 **[https://vibesync-1-3ylv.onrender.com](https://vibesync-1-3ylv.onrender.com)**

| Login | Email | Password |
|-------|-------|----------|
| Admin | smokies@gmail.com | admin123 |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎵 **Full Song Playback** | Stream complete songs via YouTube (150+ songs) |
| 🎭 **Mood Discovery** | Browse songs by 8 mood categories |
| 🔍 **Smart Search** | Search by song title or artist name |
| 📊 **Analytics Dashboard** | Charts for top songs, mood distribution |
| 🛡️ **Admin Panel** | Full CRUD for users, songs, artists, moods |
| 💾 **Database Explorer** | Run SQL queries live against the database |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |
| 🔐 **Auth System** | JWT + bcrypt password hashing |
| 📼 **Video Popup** | Toggle YouTube video player from the bottom bar |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** — dark glassmorphism UI
- **Framer Motion** — smooth animations
- **Lucide React** — icons
- **YouTube IFrame API** — full song playback

### Backend
- **Node.js** + Express.js
- **MySQL** (TiDB Cloud) via `mysql2`
- **JWT** authentication
- **bcryptjs** password hashing
- **REST API** architecture

### Database
- **11 Tables**: users, songs, artists, moods, song_mood, playlists, playlist_songs, play_history, likes, comments, followers
- **3 Views**: vw_song_details, vw_trending_songs, vw_user_stats
- **Concepts used**: INNER JOIN, LEFT JOIN, GROUP BY, HAVING, Subqueries, Views, Triggers, Cascades

---

## 📁 Project Structure

```
vibesync/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # MusicPlayer, Navbar, VibeBot
│       ├── pages/           # Landing, Explore, Analytics, Admin...
│       ├── context/         # Auth context
│       └── api/             # Axios instance
├── server/                  # Node.js backend
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── config/              # DB connection
│   ├── middleware/          # Auth middleware
│   └── database/            # Seed scripts
└── README.md
```

---

## 🗄️ Database Schema (ER Diagram)

```
users ──1:N──▶ playlists ──M:N──▶ songs ◀──1:N── artists
  │                                  │
  │                              M:N via song_mood
  │                                  │
  ├──1:N──▶ play_history          moods
  ├──M:N──▶ likes
  ├──1:N──▶ comments
  └──M:N──▶ followers (self-join)
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js 18+
- MySQL database (or TiDB Cloud)

### 1. Clone the repo
```bash
git clone https://github.com/Samvegj18/vibesync.git
cd vibesync
```

### 2. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure environment
```bash
# server/.env
DB_HOST=your-db-host
DB_PORT=4000
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=vibesync
JWT_SECRET=your-secret
PORT=5000
```

### 4. Seed the database
```bash
cd server
node database/seedSongs.js
```

### 5. Build frontend & start
```bash
# Build React app
cd client && npm run build

# Copy to server/public
cp -r dist/* ../server/public/

# Start server
cd ../server && npm start
```

### 6. Open in browser
```
http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/register` | Register |
| `GET` | `/api/songs` | Get all songs |
| `GET` | `/api/songs/search?q=` | Search songs |
| `GET` | `/api/moods` | Get all moods |
| `GET` | `/api/moods/:id/songs` | Songs by mood |
| `GET` | `/api/analytics/overview` | Platform stats |
| `GET` | `/api/admin/users` | All users (admin) |

---

## 🎓 DBMS Concepts Demonstrated

This project was built as a **DBMS Mini Project** for IV Semester, demonstrating:

- ✅ **INNER JOIN** — songs with artist names
- ✅ **LEFT JOIN** — moods with optional song counts
- ✅ **GROUP BY + COUNT/SUM** — analytics aggregation
- ✅ **HAVING** — filter aggregated results
- ✅ **Subquery** — songs above average play count
- ✅ **Views** — pre-built query views
- ✅ **Many-to-Many** — song_mood junction table
- ✅ **Self-referencing FK** — followers table
- ✅ **Prepared Statements** — SQL injection prevention
- ✅ **ON DELETE CASCADE** — referential integrity

---

## 👨‍💻 Developer

**Samveg J** — 3rd Year, MSRIT  
Subject: Database Management Systems (IV Semester)

---

<div align="center">
Made with ❤️ and ☕ | MSRIT 2026
</div>
