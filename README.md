# AI Interview Prep 🚀

A full-stack web application designed to help users prepare for technical interviews using AI-driven feedback. The platform offers timed quizzes, MCQ-based assessments, audio-visual mock interviews, resume analysis, and a professional analytics dashboard to track progress.

## ✨ Features

### 🛡️ Role-Based Access Control (RBAC)
- **User Role**: Standard access to quizzes, interviews, and analytics.
- **Admin Role**: Full access to the **Admin Console** to manage users, content, and system feedback.
- **Mentor Role**: Specialized dashboard to track and review mentee progress (Coming Soon).
- **Secure Routes**: Dynamic authorization middleware ensures data security.

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

### 🧠 Core Features
- **Timed Quizzes**: Interactive quiz experience with real-time countdown.
- **MCQ Support**: Coverage for DSA, OOPS, DBMS, and Web Dev topics.
- **AI Chatbot**: Built-in 24/7 assistant for coding queries.
- **Responsive Design**: Modern "Neon Glass" aesthetic optimized for all devices.

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Recharts, Framer Motion, Lucide React, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer (File Uploads)
- **AI Integration**: Google Gemini API / OpenAI API
- **Authentication**: JWT (JSON Web Tokens), BCryptJS

## 📂 Project Structure

```text
AI-Interview-prep/
├── backend/            # Express server & API
│   ├── models/         # User, Question, Quiz, Interview, Resume schemas
│   ├── routes/         # API routes (Auth, Admin, Analytics, etc.)
│   ├── middleware/     # Auth (Protect, Authorize) & Error handling
│   └── server.js       # Entry point
├── frontend/           # React application
│   ├── src/            
│   │   ├── components/ # Reusable UI components
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── MockInterviewPage.jsx
│   │   ├── ResumePage.jsx
│   │   └── ...
│   └── public/         # Static assets
└── screenshots/        # Project demos
```

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed or a MongoDB Atlas URI
- API Key for Google Gemini or OpenAI

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Interview-prep
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory and add:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm start
     ```
