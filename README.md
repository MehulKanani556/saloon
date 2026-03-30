# Beauty Parlour Management System

A full-stack web application for managing a beauty parlour — appointments, clients, staff, services, sales, invoices, and more.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Redux Toolkit + React Redux
- Tailwind CSS
- Framer Motion
- Recharts
- React Router DOM v6
- Formik + Yup
- Axios
- Lucide React (icons)
- date-fns / date-fns-tz
- react-hot-toast
- clsx + tailwind-merge

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken + bcryptjs)
- Multer + Sharp (image uploads)
- Cloudinary (cloud image storage)
- PDFKit (invoice generation)
- Socket.IO
- Morgan (HTTP logging)
- Moment.js
- dotenv, cors

---

## Project Structure

```
beauty-parlour/
├── client/                 # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level page components
│       ├── redux/          # Redux store & slices
│       └── utils/          # API helpers & constants
└── server/                 # Express backend
    ├── config/             # DB connection
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth & upload middleware
    ├── models/             # Mongoose models
    ├── routes/             # Express routers
    └── uploads/            # Local image uploads (gitignored)
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd beauty-parlour
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd client
npm install
```

4. Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

---

## Running the App

Start the backend:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

---

## Features

- Admin authentication with JWT
- Dashboard with analytics & charts
- Appointment scheduling & management
- Client management with profile images
- Staff management
- Services & categories
- Sales tracking
- Invoice generation (PDF)
- Reviews
- Reports
- App settings
- Real-time updates via Socket.IO
