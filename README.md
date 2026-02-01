# Prepfolio AI 🚀

[**View Live Demo**](https://ai-interview-prep-coral.vercel.app/) | [**Report Bug**](#) | [**Request Feature**](#)

Prepfolio AI is a comprehensive, full-stack web application designed to democratize technical interview preparation. By leveraging the power of **Google Gemini Pro**, it provides users with personalized, real-time feedback on mock interviews, resume scanning, and technical quizzes. The platform features a premium "Neon Glass" aesthetic, a robust admin console, and role-based access control.

---

## ✨ Features

### � New Newsletter & About Page
- **Newsletter Subscription**: Integrated footer component to capture user emails for updates, with real-time validation and duplicate checking.
- **Dedicated About Page**: A visual showcase of the project's mission, technology stack, and creator details, featuring a direct GitHub profile integration.

### 🛡️ Enhanced Admin Console
- **Quick Actions**: One-click access to create questions or view feedback.
- **System Health**: Real-time mock status indicators for Database, API, and Server latency.
- **User Management**: Advanced search, filtering, and role management with member-since context.
- **Visual Upgrades**: Professional avatars, neon-glass distinct badges, and responsive tables.

### 📊 Analytics & Insights
- **Progress Dashboard**: Interactive charts visualizing **Accuracy Trends** and **Topic Mastery** (using Recharts).
- **AI Readiness Score**: Calculate your interview readiness based on performance history.
- **Personalized Insights**: AI-generated feedback highlighting strengths and areas for improvement.

### 🎤 AI Mock Interview
- **Voice-Enabled**: Speak your answers using the microphone.
- **Real-Time AI Feedback**: Get instant analysis on your communication confidence, clarity, and technical accuracy.
- **Dynamic Questions**: Conversations adapt based on your responses.

### 📄 AI Resume Scanner
- **PDF Analysis**: Upload your resume to get an instant breakdown.
- **Role Match Score**: See how well your resume fits your target job description.
- **Actionable Tips**: Receive specific suggestions to improve your CV.

### 🧠 Core Functionality
- **Timed Quizzes**: Interactive quiz experience with real-time countdown.
- **MCQ Support**: Coverage for DSA, OOPS, DBMS, and Web Dev topics.
- **AI Chatbot**: Built-in 24/7 assistant for coding queries.
- **Responsive Design**: Modern "Neon Glass" aesthetic optimized for Mobile, Tablet, and Desktop.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router v7, Framer Motion, Recharts, Lucide React, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer
- **AI Engine**: Google Generative AI (Gemini Pro)
- **Authentication**: JWT (JSON Web Tokens), BCryptJS
- **Deployment**: Render / Vercel (Production Ready)

---

## 📂 Project Structure

```text
AI-Interview-prep/
├── backend/            # Express server & API routes
│   ├── models/         # Database schemas (User, Newsletter, Question, etc.)
│   ├── routes/         # REST API endpoints
│   └── server.js       # Entry point with static serving logic
├── frontend/           # React application
│   ├── src/            
│   │   ├── pages/      # Route pages (About, Dashboard, etc.)
│   │   ├── components/ # Reusable UI components
│   │   └── api.js      # Centralized API service
└── package.json        # Root configuration for simplified deployment
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas URI
- Google Gemini API Key

### Simplified Setup

This project uses a root-level `package.json` to manage both frontend and backend.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd AI-Interview-prep
    ```

2.  **Install All Dependencies**:
    ```bash
    npm run install-all
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_super_secret_key
    GEMINI_API_KEY=your_gemini_api_key
    NODE_ENV=development
    ```

4.  **Run Locally (Dev Mode)**:
    This command runs both the backend server and frontend client concurrently:
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:5000`

---

## 🌐 Deployment

The project is **production-ready** for platforms like **Render** or **Heroku**.

### Steps for Render.com:
1.  Connect your GitHub repository.
2.  Render will auto-detect the root `package.json`.
3.  **Build Command**: `npm run build`
4.  **Start Command**: `npm start`
5.  **Environment Variables**: Add your `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` in the Render dashboard.

### Manual Build
To create a production build manually:
```bash
npm run build
# This installs dependencies and builds the React app into backend/public/
```

---

## 👤 Author

**Yash Vyas**
- GitHub: [@Yash-Vyas123](https://github.com/Yash-Vyas123)
- LinkedIn: [Yash Vyas](https://www.linkedin.com/in/yash-vyas-)

---

<p align="center">
  Built with ❤️ using the MERN Stack + Google Gemini
</p>
