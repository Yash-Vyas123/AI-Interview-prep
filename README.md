# AI Interview Prep 

A full-stack web application designed to help users prepare for technical interviews using AI-driven feedback. The platform offers timed quizzes, MCQ-based assessments, and a professional dashboard to track progress.

##  Features

- **User Authentication**: Secure Login and Registration system.
- **AI-Powered Feedback**: Integrated with Google Gemini/OpenAI API to provide detailed feedback on quiz performance.
- **Timed Quizzes**: Interactive quiz experience with real-time countdown.
- **MCQ Support**: Support for Multiple Choice Questions across various topics (DSA, OOPS, DBMS, Web Dev).
- **Admin Dashboard**: Comprehensive management interface for questions and user feedback.
- **User Profiles**: Manage personal details and profile pictures.
- **AI Chatbot**: Built-in chatbot for instant assistance.
- **Responsive Design**: Modern, "Neon Glass" aesthetic optimized for all devices.

## 🛠️Tech Stack

- **Frontend**: React.js, React Router, CSS3 (Glassmorphism), Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini API / OpenAI API
- **Authentication**: JWT, BCryptJS

## 📂Project Structure

```text
AI-Interview-prep/
├── backend/            # Express server, MongoDB models, and API routes
│   ├── models/         # Database schemas (User, Question, Quiz, Feedback)
│   ├── routes/         # API endpoints (Auth, AI, Questions, Quizzes)
│   ├── middleware/     # Auth and validation middleware
│   └── server.js       # Entry point for the backend
├── frontend/           # React application
│   ├── src/            # Components, pages, and assets
│   │   ├── LoginPage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ChatbotWidget.jsx
│   └── public/         # Static assets
└── screenshots/        # Project screenshots and demos
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
     # OR
     OPENAI_API_KEY=your_openai_api_key
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


