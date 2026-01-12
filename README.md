# ManviHub.ai
**The ultimate clean and accessible hub to discover, compare, and build your AI toolkit with confidence.**

## 🚀 One-Click Deployment

Follow these buttons to deploy your own instance for free.

### 1. Backend (Deploy First)
Click the button below to deploy the Node.js backend to Render.
1. Sign up/Log in to Render.
2. It will ask for `MONGODB_URI` (from your MongoDB Atlas setup) and `CLIENT_URL`.
3. For `CLIENT_URL`, just put `*` initially. You can update it to your Frontend URL later.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jchandrashekar333/manviHub.ai)

### 2. Frontend
Click the button below to deploy the React frontend to Vercel.
1. Sign up/Log in to Vercel.
2. Set the `Root Directory` to `frontend`.
3. It will ask for `VITE_API_URL`. Paste the URL of your deployed Backend (e.g. `https://manvihub-backend.onrender.com/api`).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jchandrashekar333/manviHub.ai/tree/main/frontend&env=VITE_API_URL)

## 🛠️ Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```
