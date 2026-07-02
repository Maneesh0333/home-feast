# 🍱 HomeFeast

A full-stack MERN-based homemade food and tiffin subscription platform connecting users with verified home cooks offering healthy, hygienic, and affordable meals.


# ✨ Features

## 👤 User
- User registration & login
- Browse nearby home cooks
- Search and filter meals
- Subscribe to daily/weekly/monthly meal plans
- Manage subscriptions
- View order history
- Wishlist favorite cooks
- Leave ratings and reviews

## 👩‍🍳 Home Cook / Tiffin Provider
- Create and manage profile
- Add and manage menus
- Set meal pricing and plans
- Manage availability and delivery timings
- Accept or reject subscriptions
- Track earnings
- View customer reviews

## 🛠️ Admin
- Dashboard overview
- Approve cook registrations
- Manage users and cooks
- Manage cuisines and categories
- Monitor subscriptions and orders
- Handle complaints and disputes
- Manage reviews and platform activity



# 🚀 Tech Stack

## 🎨 Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Query / TanStack Query
- React Hook Form
- Zod / Yup Validation
- Axios
- Zustand
- ShadCN UI
- Recharts
- Leaflet
- Nominatim (Location Search & Geocoding)

## ⚙️ Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer
- Cookie Parser
- Node-cron


# 🔐 Authentication System

HomeFeast uses a secure JWT-based authentication system.

- Access Token stored in memory
- Refresh Token stored in secure HTTP-only cookies
- Token refresh mechanism for session persistence
- Role-based protected routes

> **Important Note:**  
> Since refresh tokens are stored in cookies, browsers must allow third-party cookies during cross-origin deployments. If third-party cookies are blocked, users may need to log in again after refreshing the page or reopening the application because the in-memory access token will be cleared.


# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```bash
cd backend
touch .env
```

Add the following variables:

```env
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/HomeFeast

PORT=5000

FRONTEND_URL=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```


# 🧩 Main Modules

## 🔑 Authentication
- JWT access & refresh tokens
- OTP email verification
- Protected routes
- Role-based authorization

## 🍱 Subscription System
- Daily/Weekly/Monthly meal plans
- Subscription management
- Plan activation and expiration tracking

## 🍛 Menu Management
- Add/edit menu items
- Meal type management
- Cuisine categorization
- Availability handling

## ⭐ Reviews & Ratings
- Customer feedback system
- Ratings aggregation
- Cook performance monitoring

## 📊 Dashboard & Analytics
- Earnings overview
- Subscription statistics
- User activity monitoring
- Admin analytics dashboard


# 📁 Project Structure

```bash
HomeFeast/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── utils/
│
└── README.md
```


# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/homefeast.git
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```


# 🌍 Deployment

## Frontend
- Vercel

## Backend
- Render

## Database
- MongoDB Atlas


# 🎥 Demo
https://github.com/user-attachments/assets/b0191bc1-d660-461f-af68-791d6c427588


