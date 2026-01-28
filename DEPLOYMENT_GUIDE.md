# Deployment Guide & Secrets Setup 🔐

This guide will help you get the necessary keys for your deployment on Render/Heroku.

## 1. MongoDB Atlas (Database) 🍃

Since you don't have a database yet, follow these exact steps to create a free one:

1.  **Register**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (you can use your Google account).
2.  **Create Cluster**: 
    *   Choose the **FREE (Shared)** option.
    *   Select a provider (AWS corresponds to most free tiers) and a region close to you (e.g., Mumbai `ap-south-1`).
    *   Click **"Create Cluster"**.
3.  **Security Setup (Crucial)**:
    *   **Username & Password**: Create a database user (e.g., user: `yash`, password: `securepassword123`). **Write these down!**
    *   **IP Whitelist**: Choose **"Allow Access from Anywhere"** (Enter `0.0.0.0/0`). This allows Render to connect to your database.
4.  **Get Connection String**:
    *   Click **"Connect"**.
    *   Choose **"Drivers"**.
    *   Copy the string that looks like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
5.  **Finalize**:
    *   Replace `<username>` with your username (e.g., `yash`).
    *   Replace `<password>` with the password you created in step 3.
    *   **Result**: This is your `MONGO_URI`.

---

## 2. JWT Secret 🔑

This is used to encrypt user logins. You can use any random long string.
**I generated one for you just now:**
`96220415fc722b5ef6bd4ed9b43cd8610cb279f0cc3340223c9d7465e5ec933b`

---

## 3. Gemini API Key 🤖

You likely already have this in your local `.env` file since the app was working.
1.  Check your local `backend/.env` file.
2.  If lost, get a new one here: [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Summary of Environment Variables for Render

| Key | Value Example |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://yash:password123@cluster0...` |
| `JWT_SECRET` | `96220415fc722b5ef6bd4ed9b43cd8610cb279f0cc3340223c9d7465e5ec933b` |
| `GEMINI_API_KEY`| `AIzaSyB...` (Your Google Key) |
| `NODE_ENV` | `production` |
