# 🏥 CarePulse Clinic - Appointment Booking System

A full-stack modern Healthcare & Doctor Appointment Booking application built with **React (Vite)**, **Node.js + Express**, **MongoDB (Mongoose)**, and **JWT Authentication**.

---

## 🌟 Features

### 👤 Patient Features
- **User Authentication**: Secure Registration & Login with JWT session persistence.
- **Doctor Directory**: View doctors, filter by specialization, and search by doctor name or condition.
- **Doctor Profiles**: Comprehensive doctor details including experience, fee, available days, and daily time slots.
- **Interactive Booking**: Book available time slots for specific dates with real-time slot conflict prevention.
- **Personal Dashboard**: View all personal bookings, track appointment status (`Confirmed`, `Pending`, `Completed`, `Cancelled`), and cancel bookings with instant confirmation.
- **One-Click Demo Login**: Built-in instant login buttons for testing.

### 🛡️ Admin Features
- **Admin Dashboard**: Overview statistics (Total Doctors, Total Appointments, Confirmed Bookings, Pending Requests).
- **Manage Doctors**: Add new doctors, edit existing profiles, and delete doctors.
- **Manage Appointments**: View all patient bookings across the clinic and update appointment statuses (`Confirmed`, `Pending`, `Completed`, `Cancelled`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Lucide React Icons, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
- **Database**: MongoDB using Mongoose ODM, with automatic `mongodb-memory-server` fallback for zero-setup local development.

---

## 📁 Project Structure

```
clinic/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & memory fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── doctorController.js   # CRUD operations for doctors
│   │   └── appointmentController.js # Booking & status management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & Admin authorization
│   │   └── errorMiddleware.js    # Global error handlers
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   ├── Doctor.js             # Doctor schema (name, spec, days, slots, fee)
│   │   └── Appointment.js        # Appointment schema (user, doctor, date, slot, status)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── doctorRoutes.js       # /api/doctors routes
│   │   └── appointmentRoutes.js  # /api/appointments routes
│   ├── scripts/
│   │   └── seed.js               # Database seeding script
│   ├── .env.example              # Sample environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation header
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── ProtectedRoute.jsx# Auth & role route guard
│   │   │   ├── DoctorCard.jsx    # Doctor card component
│   │   │   ├── DoctorModal.jsx   # Admin Add/Edit doctor modal
│   │   │   └── Alert.jsx         # Status banner alerts
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # React Context for authentication
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, spotlight, and features
│   │   │   ├── RegisterPage.jsx  # Patient registration form
│   │   │   ├── LoginPage.jsx     # Patient & Admin login form
│   │   │   ├── DoctorsPage.jsx   # Directory with search & filters
│   │   │   ├── DoctorDetailsPage.jsx # Doctor profile & schedule
│   │   │   ├── BookingPage.jsx   # Interactive appointment scheduling
│   │   │   ├── MyAppointmentsPage.jsx # Patient booking history
│   │   │   └── AdminDashboardPage.jsx # Admin management portal
│   │   ├── services/
│   │   │   └── api.js            # Centralized API fetch client
│   │   ├── App.jsx               # Main React routes
│   │   ├── main.jsx              # React app mounting
│   │   └── index.css             # Healthcare UI design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Set Up Backend

```bash
cd backend
npm install
```

#### Environment Variables (`backend/.env`)
Create a `.env` file in the `backend/` directory (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/clinic_booking
JWT_SECRET=supersecretclinicjwtkey2026_clinic_app_secure_token
```

> **Note**: If a local MongoDB instance is not running on `MONGO_URI`, the server automatically spins up an in-memory MongoDB instance for instant out-of-the-box development!

#### Seed Database
Populate initial doctors, admin user, and sample patient:

```bash
npm run seed
```

#### Start Backend Server
```bash
npm start
# Server starts on http://localhost:5000
```

---

### 2. Set Up Frontend

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `admin123` |
| **Patient** | `patient@clinic.com` | `patient123` |

> *Tip: You can also click the **Patient Demo** or **Admin Demo** buttons on the Login page to auto-fill credentials!*

---

## 📡 API Endpoints Reference

### 🔐 Auth Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new patient account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Get current logged-in user profile |

### 👨‍⚕️ Doctor Endpoints (`/api/doctors`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | Get all doctors (supports `?specialization=` & `?search=`) |
| `GET` | `/api/doctors/:id` | Public | Get single doctor details by ID |
| `POST` | `/api/doctors` | Admin | Create a new doctor profile |
| `PUT` | `/api/doctors/:id` | Admin | Update doctor details |
| `DELETE` | `/api/doctors/:id` | Admin | Delete doctor and cleanup appointments |

### 📅 Appointment Endpoints (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Private | Book a doctor appointment slot |
| `GET` | `/api/appointments/my-bookings` | Private | Fetch logged-in patient's appointments |
| `GET` | `/api/appointments` | Admin | Fetch all clinic appointments |
| `PUT` | `/api/appointments/:id` | Private/Admin | Update appointment status |
| `DELETE` | `/api/appointments/:id` | Private/Admin | Cancel appointment |

---

## 📄 License
This project is open-source and available under the MIT License.
