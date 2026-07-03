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


#📸 Screenshots

## User
<img width="1365" height="619" alt="Screenshot 2026-07-04 001010" src="https://github.com/user-attachments/assets/4d926391-0617-46d7-90aa-cda4d6c76aab" />
<img width="1353" height="628" alt="Screenshot 2026-07-04 001111" src="https://github.com/user-attachments/assets/1babf6d2-8352-4c00-b649-0a0febbf45e5" />


## Admin
<img width="1355" height="627" alt="Screenshot 2026-07-04 001327" src="https://github.com/user-attachments/assets/f7fbc2f3-c9f7-49b1-b8e8-4e81e3f10d0a" />
<img width="1365" height="632" alt="Screenshot 2026-07-04 001717" src="https://github.com/user-attachments/assets/38fa4071-c74a-46c2-a291-f4931b989f6a" />

## Cook
<img width="1345" height="632" alt="Screenshot 2026-07-04 001533" src="https://github.com/user-attachments/assets/fec878dd-1aeb-43fd-ac90-d28a8c20732a" />
<img width="1352" height="631" alt="Screenshot 2026-07-04 001452" src="https://github.com/user-attachments/assets/e28d5396-8fc7-4157-951e-cb64ec6d1a41" />



# 🎥 Demo
https://github.com/user-attachments/assets/b0191bc1-d660-461f-af68-791d6c427588


