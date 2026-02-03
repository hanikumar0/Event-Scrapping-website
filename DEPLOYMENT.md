# 🚀 Hosting Your MERN Application

To host your project for free and show it to recruiters, follow this 3-step guide using **MongoDB Atlas**, **Render** (Backend), and **Vercel** (Frontend).

---

## Step 1: Database (MongoDB Atlas)
1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (the free shared tier).
3.  Go to **Database Access** -> Add New Database User (Keep the password safe).
4.  Go to **Network Access** -> Add IP Address -> Select "Allow Access From Anywhere" (0.0.0.0/0).
5.  Go to **Clusters** -> Connect -> "Connect your application" -> Copy the Connection String.
6.  Replace `<password>` in the string with your user password.

---

## Step 2: Backend (Render.com)
1.  Push your code to **GitHub**.
2.  Create an account at [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Configure:
    *   **Name**: `sydevents-api`
    *   **Root Directory**: `server`
    *   **Runtime**: `Node`
    *   **Package Manager**: `npm`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
6.  Add **Environment Variables**:
    *   `PORT`: `5000`
    *   `MONGODB_URI`: (Your Atlas string from Step 1)
    *   `GOOGLE_CLIENT_ID`: (From Google Console)
    *   `GOOGLE_CLIENT_SECRET`: (From Google Console)
    *   `SESSION_SECRET`: (Any random long string)
    *   `FRONTEND_URL`: (You will get this in Step 3, e.g., `https://sydevents.vercel.app`)
    *   `EMAIL_USER`: `hanikumar064@gmail.com`
    *   `EMAIL_PASS`: `dazmarwoyotaholq`
    *   `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: `true` (Render installs Chrome via Buildpacks)
7.  **Important**: In Render Settings, add a **Secret File** or Buildpack for Chrome if the scraper fails. (Render usually works out of the box with `puppeteer`).

---

## Step 3: Frontend (Vercel)
1.  Go to [Vercel](https://vercel.com/) and connect your GitHub.
2.  Select **New Project** -> Select your repo.
3.  Configure:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `client`
4.  Add **Environment Variables**:
    *   `VITE_API_URL`: (Your Render URL, e.g., `https://sydevents-api.onrender.com/api`)
5.  Click **Deploy**.

---

## 🔐 Crucial: Update Google Console
Once you have your production URLs:
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Update **Authorized JavaScript origins**:
    - `https://sydevents.vercel.app`
3.  Update **Authorized redirect URIs**:
    - `https://sydevents-api.onrender.com/auth/google/callback`

---

## 💡 Pro Tip for Internship
When you share the link with recruiters, include the **Admin Credentials** in your email so they can log in and see the dashboard you built!
