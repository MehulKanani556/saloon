# Glow & Elegance — Salon Management System

A full-stack luxury salon management web application built with React and Node.js. Covers everything from appointment booking and staff management to e-commerce, invoicing, and real-time notifications.

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Redux Toolkit + React Redux | Global state management |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts | Charts & data visualization |
| Formik + Yup | Form handling & validation |
| Axios | HTTP client |
| Stripe.js + React Stripe.js | Payment UI (card elements) |
| Socket.IO Client | Real-time communication |
| Lucide React | Icon library |
| date-fns | Date formatting & manipulation |
| react-hot-toast | Toast notifications |
| canvas-confetti | Booking success animation |

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database & ODM |
| jsonwebtoken + bcryptjs | JWT auth & password hashing |
| Multer + Sharp | Image upload & processing |
| AWS S3 SDK | Cloud image storage |
| PDFKit | Invoice PDF generation |
| Socket.IO | Real-time events |
| Stripe | Payment intents & webhooks |
| Nodemailer | Email OTP delivery |
| Twilio | SMS OTP delivery |
| Moment.js | Date/time utilities |
| Morgan | HTTP request logging |
| cookie-parser | Refresh token cookie handling |

---

## Project Structure

```
glow-elegance/
├── back/                        # Express backend
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── s3.js                # AWS S3 config
│   ├── controllers/             # Route handlers
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── clientController.js
│   │   ├── dashboardController.js
│   │   ├── invoiceController.js
│   │   ├── leaveController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── reportsController.js
│   │   ├── reviewController.js
│   │   ├── salesController.js
│   │   ├── serviceController.js
│   │   ├── settingController.js
│   │   ├── specializationController.js
│   │   ├── staffController.js
│   │   ├── webhookController.js
│   │   └── wishlistController.js
│   ├── helpers/
│   │   ├── otpHelper.js         # Email & SMS OTP dispatch
│   │   └── socketHelper.js      # Socket.IO init & admin notify
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect & role authorize
│   │   └── uploadMiddleware.js  # Multer + Sharp + S3 pipeline
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Category.js
│   │   ├── Leave.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   ├── Service.js
│   │   ├── Setting.js
│   │   ├── SpecializationRequest.js
│   │   └── User.js
│   ├── routes/
│   │   └── indexRoute.js        # All API routes
│   ├── scripts/
│   │   ├── seedData.js
│   │   └── updateIds.js
│   ├── utils/
│   │   └── s3Utils.js
│   ├── index.js                 # Entry point
│   └── package.json
│
└── front/                       # React + Vite frontend
    ├── public/
    │   ├── hero_bg.png
    │   ├── salon_ambiance.png
    │   └── icons.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── AdminHeader.jsx
    │   │   │   └── Modal.jsx
    │   │   ├── public/
    │   │   │   ├── PublicNavbar.jsx
    │   │   │   ├── PublicFooter.jsx
    │   │   │   ├── StatsBanner.jsx
    │   │   │   └── UserPanelLayout.jsx
    │   │   ├── CustomSelect.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Skeleton.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── (public)
    │   │   │   ├── Home.jsx
    │   │   │   ├── PublicServices.jsx
    │   │   │   ├── Shop.jsx
    │   │   │   ├── ProductDetail.jsx
    │   │   │   ├── BookAppointment.jsx
    │   │   │   ├── About.jsx
    │   │   │   └── Contact.jsx
    │   │   ├── (auth)
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── (admin)
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Appointments.jsx
    │   │   │   ├── AdminServices.jsx
    │   │   │   ├── AdminProducts.jsx
    │   │   │   ├── AdminOrders.jsx
    │   │   │   ├── Staff.jsx
    │   │   │   ├── Clients.jsx
    │   │   │   ├── Categories.jsx
    │   │   │   ├── Sales.jsx
    │   │   │   ├── Invoices.jsx
    │   │   │   ├── Reports.jsx
    │   │   │   ├── Leaves.jsx
    │   │   │   ├── Specializations.jsx
    │   │   │   └── Settings.jsx
    │   │   ├── (staff)
    │   │   │   ├── StaffDashboard.jsx
    │   │   │   └── StaffSettings.jsx
    │   │   └── (user)
    │   │       ├── Profile.jsx
    │   │       ├── MyAppointments.jsx
    │   │       ├── MyOrders.jsx
    │   │       ├── Cart.jsx
    │   │       ├── Wishlist.jsx
    │   │       ├── Checkout.jsx
    │   │       ├── ChangePassword.jsx
    │   │       └── DeleteAccount.jsx
    │   ├── redux/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── appointmentSlice.js
    │   │   │   ├── cartSlice.js
    │   │   │   ├── categorySlice.js
    │   │   │   ├── clientSlice.js
    │   │   │   ├── dashboardSlice.js
    │   │   │   ├── orderSlice.js
    │   │   │   ├── productSlice.js
    │   │   │   ├── reportSlice.js
    │   │   │   ├── reviewSlice.js
    │   │   │   ├── salesSlice.js
    │   │   │   ├── serviceSlice.js
    │   │   │   ├── settingSlice.js
    │   │   │   ├── staffSlice.js
    │   │   │   └── wishlistSlice.js
    │   │   └── store.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── BASE_URL.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- AWS S3 bucket (for image storage)
- Stripe account (for payments)
- Nodemailer-compatible email account (for OTP)
- Twilio account (for SMS OTP — optional)

### 1. Clone the repo

```bash
git clone <repo-url>
cd glow-elegance
```

### 2. Backend setup

```bash
cd back
npm install
```

Create `back/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

NODE_ENV=development
CLIENT_URL=http://localhost:3000

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

# Stripe
STRIPE_SECRET=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email OTP (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS OTP (Twilio — optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

### 3. Frontend setup

```bash
cd front
npm install
```

Create `front/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_your_stripe_publishable_key
VITE_IMAGE_URL=http://localhost:5000
```

### 4. Run the app

Backend:
```bash
cd back
npm run dev
```

Frontend:
```bash
cd front
npm run dev
```

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5000/api`

---

## User Roles

| Role | Access |
|---|---|
| Admin | Full access — dashboard, staff, clients, services, products, orders, reports, settings |
| Staff | Staff dashboard, own appointments, leaves, specialization requests, invoices |
| User | Public site, booking, shop, cart, wishlist, checkout, order history, profile |

---

## Features

### Public
- Home page with services preview, team, and testimonials
- Full services listing with category filter and pagination
- Shop with product search and category filter
- Product detail with reviews
- Appointment booking with service/staff selection and time slot validation
- About & Contact pages

### Authentication
- Email/password login
- OTP login via email or phone
- JWT access token + refresh token (httpOnly cookie)
- Signup, logout, soft delete account
- Change password

### Admin Panel
- Dashboard with revenue charts, busy hours, upcoming appointments
- Appointment calendar with leave overlay
- Staff CRUD with service assignment
- Client directory with appointment history
- Service & category management
- Product inventory management
- Order management with status updates
- Sales & financial overview with revenue charts
- Invoice PDF generation per appointment
- Business reports with monthly charts
- Leave request approval/rejection
- Staff specialization request approval
- Salon settings (business hours, payment methods, logo)

### Staff Panel
- Personal dashboard with revenue, specializations, upcoming appointments
- Quick appointment status update
- Leave request submission
- Specialization update requests
- Profile & password management

### User Panel
- My appointments with cancellation
- Service & staff reviews after completed appointments
- My orders with product reviews
- Cart management
- Wishlist
- Stripe checkout with shipping details
- Profile management
- Change password / delete account

### Other
- Real-time admin notifications via Socket.IO
- Cart & wishlist synced to server on login
- PDF invoice download
- Image uploads via AWS S3

---

## API Routes

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/send-otp` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |
| PUT | `/api/auth/change-password` | Private |
| DELETE | `/api/auth/profile` | Private |

### Appointments
| Method | Route | Access |
|---|---|---|
| GET | `/api/appointments` | Admin, Staff |
| GET | `/api/appointments/my` | Private |
| POST | `/api/appointments` | Public |
| POST | `/api/appointments/occupied-slots` | Public |
| PUT | `/api/appointments/:id` | Admin, Staff |
| PUT | `/api/appointments/:id/status` | Admin, Staff |
| DELETE | `/api/appointments/:id` | Admin, Staff, User |

### Services / Categories / Staff / Clients
Standard CRUD — GET (public), POST/PUT/DELETE (Admin only for services/categories/staff, Admin+Staff for clients)

### Products & Orders
| Method | Route | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products/:id/reviews` | Private |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/orders` | Private |
| GET | `/api/orders/my` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| PUT | `/api/orders/:id/cancel` | Private |

### Other
| Method | Route | Access |
|---|---|---|
| POST | `/api/payment/create-payment-intent` | Private |
| POST | `/api/webhooks/stripe` | Public (Stripe) |
| GET | `/api/invoices/export-pdf/:id` | Admin, Staff |
| GET | `/api/reports/intel` | Admin |
| GET | `/api/sales/matrix` | Admin |
| POST | `/api/sales/withdraw` | Admin |
| GET | `/api/dashboard` | Admin, Staff |
| POST | `/api/reviews` | Private |
| GET | `/api/reviews/:targetId` | Public |
| GET | `/api/cart` | Private |
| POST | `/api/cart/sync` | Private |
| GET | `/api/wishlist` | Private |
| POST | `/api/wishlist/sync` | Private |
| POST | `/api/leaves` | Staff |
| GET | `/api/leaves/my` | Staff |
| GET | `/api/leaves` | Admin |
| PUT | `/api/leaves/:id` | Admin |
| POST | `/api/specializations/requests` | Staff |
| GET | `/api/specializations/my-requests` | Staff |
| GET | `/api/specializations/all-requests` | Admin |
| PUT | `/api/specializations/requests/:id` | Admin |
