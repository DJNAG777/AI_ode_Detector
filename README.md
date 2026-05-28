# ⚡ AI Code Detector

A production-ready full stack MERN web application that detects whether source code is AI-generated or human-written using AST analysis + Google Gemini AI.

## 🚀 Features

- **Single Code Detection** — Paste code and get AI/Human probability instantly
- **Code Comparison** — Compare two code snippets side by side
- **Batch File Upload** — Upload .c, .cpp, .java, .py, or .zip files
- **AST Analysis** — Deep syntax tree analysis of code structure
- **Gemini AI Integration** — Google Gemini evaluates code patterns
- **Detailed Reports** — Factor-by-factor breakdown with charts
- **PDF Download** — Download detection reports as PDF
- **User Dashboard** — Track detection history and favorites
- **Admin Panel** — Platform analytics and user management
- **JWT Authentication** — Secure login/registration

## 📁 Project Structure

```
ai-code-detector/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # All page components
│       ├── components/ # Reusable components
│       └── services/   # API service layer
└── server/          # Node.js + Express backend
    ├── controllers/ # Route handlers
    ├── routes/      # API routes
    ├── models/      # MongoDB models
    ├── middleware/  # Auth middleware
    └── services/    # Gemini & AST services
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key (free at https://aistudio.google.com)

---

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-code-detector
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
npm run dev   # Development with nodemon
npm start     # Production
```

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm start
```

---

### 3. Create Admin User

After registering, manually update the user role in MongoDB:
```js
db.users.updateOne({ email: "admin@yoursite.com" }, { $set: { role: "admin" } })
```

---

## 🔑 Getting a Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key to your `.env` file

**Without an API key**, the app uses intelligent heuristic fallbacks based on AST analysis only.

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Push to GitHub
2. Connect repo to Render
3. Add environment variables in dashboard
4. Deploy

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy the `build/` folder

### Database (MongoDB Atlas)
1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Set as `MONGODB_URI` in backend env

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/detect/single | Detect single code |
| POST | /api/detect/compare | Compare two codes |
| POST | /api/detect/upload | Batch file upload |
| GET | /api/reports/user | Get user reports |
| GET | /api/reports/stats | Get user stats |
| GET | /api/admin/stats | Admin statistics |

---

## 🧠 Detection Algorithm

```
Final Score = (AST Score × 0.6) + (Gemini AI Score × 0.4)
```

**AST Metrics analyzed:**
- Comment ratio (low = AI indicator)
- Identifier entropy (generic names = AI)
- Code repetition patterns
- Nesting depth variance
- Cyclomatic complexity
- Function modularity

**Gemini AI evaluates:**
- Naming style
- Comment quality
- Logic complexity
- Real-world domain logic
- Human coding habits
- Error handling

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Recharts, Framer Motion, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **AI:** Google Gemini 1.5 Flash
- **Auth:** JWT + bcryptjs
- **Security:** Helmet, Rate Limiting, CORS

---

## 📄 License

MIT License — Free to use and modify.
