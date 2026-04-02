# 🩸 LifeDrop — Blood Donor Mobile App

A full-stack mobile application that connects blood donors with donation centers and enables emergency blood requests. Built with React Native (Expo) and Node.js.

---

## 📱 Screenshots

| Onboarding | Login | Home (Donor) | Map | Emergency |
|---|---|---|---|---|
| 3-slide intro | Email + password | Stats dashboard | Google Maps + centers | SOS requests |

---

## 🏗️ Tech Stack

### Mobile (Frontend)
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81+ | Cross-platform iOS & Android |
| Expo SDK | 54 | Development framework |
| Expo Router | 6.x | File-based navigation |
| TypeScript | 5.x | Type safety |
| Zustand | 4.x | Global state management |
| TanStack Query | 5.x | Server state & caching |
| Axios | Latest | HTTP client |
| React Hook Form | Latest | Form handling |
| Zod | 3.x | Schema validation |
| React Native Maps | Latest | Google Maps integration |
| Expo Location | Latest | GPS location |
| Socket.io Client | Latest | Real-time events |

### Backend (API)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express | 5.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Prisma ORM | 5.x | Database queries |
| PostgreSQL | 16 | Primary database |
| Redis | 7.x | Caching & sessions |
| JWT | Latest | Authentication |
| Bcrypt | Latest | Password hashing |
| Socket.io | 4.x | Real-time events |
| Zod | 3.x | Request validation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Local database containers |
| Git | Version control |

---

## 👥 User Roles

| Role | Description | Key Permissions |
|---|---|---|
| 🩸 **DONOR** | Blood donor | Find centers, book slots, view history |
| 🏥 **STAFF** | Hospital staff | Confirm/complete appointments, post SOS |
| 🚨 **EMERGENCY_REQUESTER** | Doctor/hospital admin | Post & manage emergency requests |
| 👑 **ADMIN** | System administrator | Manage centers, users, full access |

---

## 📁 Project Structure

```
lifedrop/
├── docker-compose.yml          # PostgreSQL + Redis containers
├── .gitignore
├── README.md
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── app.ts              # Express entry point
│   │   ├── config/
│   │   │   ├── database.ts     # Prisma client
│   │   │   ├── redis.ts        # Redis client
│   │   │   └── env.ts          # Environment validation
│   │   ├── modules/
│   │   │   ├── auth/           # Register, login, JWT
│   │   │   ├── users/          # User management (Admin)
│   │   │   ├── centers/        # Donation centers
│   │   │   ├── donations/      # Appointments & donations
│   │   │   └── emergency/      # Emergency requests
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── utils/
│   │       └── AppError.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   └── .env                    # Environment variables
│
└── mobile/                     # React Native + Expo
    ├── app/
    │   ├── _layout.tsx         # Root layout
    │   ├── index.tsx           # Auth redirect
    │   ├── (auth)/             # Login, register, onboarding
    │   ├── (tabs)/             # Main app screens
    │   │   ├── index.tsx       # Home (role-based)
    │   │   ├── map.tsx         # Find centers + Google Maps
    │   │   ├── emergency.tsx   # SOS requests
    │   │   ├── history.tsx     # Donation history (Donor)
    │   │   ├── staff.tsx       # Appointments panel (Staff)
    │   │   ├── admin.tsx       # Admin panel
    │   │   └── profile.tsx     # User profile
    │   └── center/
    │       └── [id].tsx        # Center detail + booking
    ├── constants/
    │   ├── colors.ts           # App color palette
    │   ├── config.ts           # API URL, constants
    │   └── styles.ts           # Shared StyleSheet
    ├── services/               # API call functions
    │   ├── api.ts              # Axios instance
    │   ├── auth.service.ts
    │   ├── centers.service.ts
    │   ├── donations.service.ts
    │   ├── emergency.service.ts
    │   └── admin.service.ts
    ├── store/
    │   └── authStore.ts        # Zustand auth store
    └── .env                    # Mobile environment variables
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js 20 LTS](https://nodejs.org)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com)
- [Docker Desktop](https://docker.com/products/docker-desktop)
- [Expo Go](https://expo.dev/go) — on your phone

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lifedrop.git
cd lifedrop
```

### 2. Start the Databases

```bash
# Start PostgreSQL + Redis in Docker
docker-compose up -d

# Verify both are running
docker-compose ps
```

### 3. Setup the Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start the server
npm run dev
```

✅ Server starts at `http://localhost:4000`

Verify: `http://localhost:4000/health`

### 4. Setup the Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env — set your PC's local IP address

# Start Expo
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## ⚙️ Environment Variables

### backend/.env

```env
# Database
DATABASE_URL="postgresql://admin:secret123@localhost:5432/lifedrop"

# Redis
REDIS_URL="redis://:secret123@localhost:6379"

# JWT Secrets — change in production!
JWT_SECRET="your-jwt-secret-min-32-characters"
REFRESH_SECRET="your-refresh-secret-min-32-characters"

# Server
PORT=4000
NODE_ENV=development

# Firebase (optional — for push notifications)
FCM_PROJECT_ID=""
FCM_CLIENT_EMAIL=""
FCM_PRIVATE_KEY=""
```

### mobile/.env

```env
# Your PC's local IP address (run ipconfig on Windows)
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:4000/api

# Google Maps API Key
EXPO_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...
```

> ⚠️ **Never commit .env files to Git.** They are already in .gitignore.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | All users | Get my profile |

### Centers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/centers` | All users | Get all centers |
| GET | `/api/centers/nearest?lat=&lng=` | All users | Get nearest centers |
| GET | `/api/centers/:id` | All users | Get center by ID |
| GET | `/api/centers/:id/slots?date=` | All users | Get available slots |
| POST | `/api/centers` | Admin only | Add new center |
| PUT | `/api/centers/:id` | Admin only | Update center |
| DELETE | `/api/centers/:id` | Admin only | Delete center |

### Donations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/donations/book` | Donor | Book appointment |
| GET | `/api/donations/appointments` | Donor | My appointments |
| GET | `/api/donations/history` | Donor | My donation history |
| GET | `/api/donations/stats` | Donor | My donation stats |
| GET | `/api/donations/all` | Staff + Admin | All appointments |
| GET | `/api/donations/today` | Staff + Admin | Today's appointments |
| PUT | `/api/donations/appointments/:id/confirm` | Staff + Admin | Confirm appointment |
| PUT | `/api/donations/appointments/:id/complete` | Staff + Admin | Complete donation |
| PUT | `/api/donations/appointments/:id/cancel` | All users | Cancel appointment |

### Emergency
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/emergency` | All users | Get all active requests |
| GET | `/api/emergency/my-requests` | Staff + ER | My posted requests |
| POST | `/api/emergency` | Staff + ER + Admin | Post new request |
| PUT | `/api/emergency/:id/resolve` | Staff + ER + Admin | Mark as resolved |

### Users (Admin)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/stats` | Admin | Dashboard statistics |
| GET | `/api/users` | Admin | All users |
| GET | `/api/users/:id` | Admin | User by ID |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🗄️ Database Schema

```
users               — All user accounts with roles
donation_centers    — Blood donation centers with GPS coordinates
appointments        — Donor booking slots at centers
donations           — Completed donation records
emergency_requests  — Urgent blood requests
refresh_tokens      — JWT refresh token storage
```

### Blood Groups
`A_POS` `A_NEG` `B_POS` `B_NEG` `AB_POS` `AB_NEG` `O_POS` `O_NEG`

### Donation Types
`WHOLE_BLOOD` `PLATELETS` `PLASMA` `DOUBLE_RED`

### Appointment Status
`PENDING` → `CONFIRMED` → `COMPLETED`  
or `PENDING` / `CONFIRMED` → `CANCELLED`

### Urgency Levels
`CRITICAL` `URGENT` `NEEDED`

---

## 📱 App Screens by Role

### 🩸 Donor
- Onboarding → Register → Login
- **Home** — blood type, donation count, lives saved, next eligible date
- **Find** — Google Maps with nearest centers, book a slot
- **SOS** — view and respond to emergency requests
- **History** — appointment history with status
- **Profile** — account details, logout

### 🏥 Staff
- **Home** — today's pending, confirmed, completed counts
- **Find** — view donation centers
- **SOS** — post and resolve emergency requests
- **Panel** — manage all appointments (confirm, complete, cancel), filter by status
- **Profile** — account details, logout

### 🚨 Emergency Requester
- **Home** — active emergency stats, quick actions
- **SOS** — post new requests, view all requests, manage my requests
- **Profile** — account details, logout

### 👑 Admin
- **Home** — system stats (users, donors, centers, active SOS)
- **Admin Panel** — manage centers (add/delete), manage users (view/delete)
- **Profile** — account details, logout

---

## 🔐 Authentication Flow

```
User registers/logs in
        ↓
Backend returns accessToken (15 min) + refreshToken (30 days)
        ↓
Zustand stores tokens in AsyncStorage (persists across app restarts)
        ↓
Axios interceptor attaches token to every request
        ↓
On 401 error → auto logout and redirect to login
```

---

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable: **Maps SDK for Android**, **Maps SDK for iOS**, **Geocoding API**
4. Create an API key under **Credentials**
5. Add to `mobile/.env`:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...
   ```
6. Add to `mobile/app.json` under `android.config` and `ios.config`

---

## 🧪 Testing the API

Use [Postman](https://postman.com) or any REST client.

**1. Login as Admin:**
```
POST http://localhost:4000/api/auth/login
Body: { "email": "admin@lifedrop.com", "password": "admin123456" }
```

**2. Copy the accessToken and add to Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**3. Test stats:**
```
GET http://localhost:4000/api/users/stats
```

---

## 🐳 Docker Commands

```bash
# Start databases
docker-compose up -d

# Stop databases
docker-compose down

# View logs
docker-compose logs

# Check status
docker-compose ps

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

---

## 🛠️ Useful Development Commands

```bash
# Backend
npm run dev          # Start server with hot reload
npm run build        # Build for production
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio (database browser)
npm run db:seed      # Seed database with test data

# Mobile
npx expo start          # Start Expo dev server
npx expo start --clear  # Start with cleared cache
```

---

## 🚧 Known Limitations

- Push notifications (FCM) require Firebase project setup
- SMS reminders (Twilio) require Twilio account setup
- Google Maps requires a paid API key for production use
- The app currently uses static time slots — a dynamic slot system can be added

---

## 🗺️ Roadmap

- [ ] Push notifications via Firebase Cloud Messaging
- [ ] SMS reminders via Twilio
- [ ] Staff assigned to specific centers
- [ ] Donor eligibility auto-reset after waiting period
- [ ] Admin analytics dashboard
- [ ] Rating system for donation centers
- [ ] CI/CD with GitHub Actions
- [ ] Deploy backend to AWS/Render

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Built With

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Express](https://expressjs.com)
- [Prisma](https://prisma.io)
- [PostgreSQL](https://postgresql.org)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)
