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

## Step 2: Backend (Railway.app)
1.  Log in to [Railway.app](https://railway.app/) using your GitHub account.
2.  Click **+ New Project** -> **Deploy from GitHub repo**.
3.  Select your `Event-Scrapping-website` repository.
4.  In the project settings, set the **Root Directory** to `server`.
5.  Go to the **Variables** tab and add the following:
    *   `PORT`: `5000`
    *   `MONGODB_URI`: (Your Atlas string from Step 1)
    *   `GOOGLE_CLIENT_ID`: (From Google Console)
    *   `GOOGLE_CLIENT_SECRET`: (From Google Console)
    *   `SESSION_SECRET`: (Any random long string)
    *   `FRONTEND_URL`: `https://event-scrapping-website.vercel.app`
    *   `BACKEND_URL`: `https://event-scrapping-website-production.up.railway.app`
    *   `EMAIL_USER`: `hanikumar064@gmail.com`
    *   `EMAIL_PASS`: `dazmarwoyotaholq`
6.  **Railway & Puppeteer**: Railway uses Nixpacks which usually automatically detects Puppeteer and installs Chromium. If the scraper fails, ensure `puppeteer` is in your `package.json` (it is!).

---

## Step 3: Frontend (Vercel)
1.  Go to [Vercel](https://vercel.com/) and connect your GitHub.
2.  Select **New Project** -> Select your repo.
3.  Configure:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `client`
4.  Add **Environment Variables**:
    *   `VITE_API_URL`: `https://event-scrapping-website-production.up.railway.app/api`
5.  Click **Deploy**.

---

## 🔐 Crucial: Update Google Console
Once you have your production URLs:
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Update **Authorized JavaScript origins**:
    - `https://event-scrapping-website.vercel.app`
3.  Update **Authorized redirect URIs**:
    - `https://event-scrapping-website-production.up.railway.app/auth/google/callback`

---

## 💡 Pro Tip for Internship
When you share the link with recruiters, include the **Admin Credentials** in your email so they can log in and see the dashboard you built!
