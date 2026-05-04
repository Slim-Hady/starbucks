# ☕ Starbucks E-Commerce Platform

A full-stack MERN application for browsing, ordering, and managing Starbucks products with payment integration.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- `.env` file configured (see section below)

### Run with Docker Compose

```bash
# Build and start all services (Frontend, Backend, MongoDB)
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access URLs After Docker Startup

| Service | URL | Port |
|---------|-----|------|
| **Frontend (Client)** | http://localhost | 80 |
| **Backend API** | http://localhost:3002 | 3002 |
| **MongoDB** | localhost:27017 | 27017 |

### Default Test Credentials
```
Email: admin@test.com
Password: password123
```

---

## 💻 Manual Setup (Local Development)

### 1. Download Dependencies

```bash
# Install backend dependencies
npm i

# Initialize TypeScript
npx tsc --init

# Install frontend dependencies
cd client
npm i
cd ..
```

### 2. Environment Configuration

Create `.env` file in root directory:
```env
PORT=3002
DATABASE=mongodb+srv://your-mongodb-uri
DATABASE_LOCAL=mongodb://localhost:27017/starbucks
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
# Server runs at http://localhost:3002
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs at http://localhost:5173
```

---

## 📋 API Endpoints

### Authentication Routes
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Product Routes
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (Admin)
- `PATCH /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Category Routes
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin)
- `PATCH /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Order Routes
- `GET /api/v1/orders` - Get orders
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id` - Update order status

### Payment Routes
- `POST /api/v1/payment/create-checkout` - Create Stripe checkout

---

## 🛠️ NPM Scripts

```bash
# Backend
npm run dev              # Start dev server with Nodemon
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run test             # Run all tests
npm run seed             # Seed database with initial data

# Frontend (in client directory)
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

---

## 🏗️ Project Structure

```
starbucks/
├── src/                    # Backend source (TypeScript)
│   ├── controller/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utilities & helpers
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   └── services/     # API service layer
│   └── Dockerfile        # Frontend container config
├── docker-compose.yml     # Docker orchestration
├── Dockerfile             # Backend container config
└── .env                   # Environment variables
```

---

## 🐳 Docker Troubleshooting

### Check Docker Status
```bash
docker-compose ps          # See all running containers
docker-compose logs backend # View backend logs
docker-compose logs frontend # View frontend logs
```

### Rebuild Containers
```bash
docker-compose down        # Stop all containers
docker system prune        # Clean up unused images
docker-compose up --build  # Rebuild and restart
```

### Reset Database
```bash
docker volume rm starbucks_mongo-data
docker-compose up          # Will recreate fresh MongoDB
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | 3002 |
| `DATABASE` | MongoDB Atlas URI | mongodb+srv://... |
| `DATABASE_LOCAL` | Local MongoDB URI | mongodb://mongo:27017/starbucks |
| `STRIPE_SECRET_KEY` | Stripe secret key | sk_test_... |
| `CLIENT_URL` | Frontend URL | http://localhost |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `JWT_EXPIRES_IN` | Token expiration | 7d |

---

## 🧪 Testing

```bash
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
```

---

## 📦 Technology Stack

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, Stripe  
**Frontend:** React, Vite, TailwindCSS, React Router, Context API  
**Deployment:** Docker, Vercel (Frontend), Render (Backend), MongoDB Atlas

---

## 📚 Additional Resources

- See `DEPLOY.md` for cloud deployment instructions
- See `client/README.md` for frontend-specific setup
- See `src/models/README.md` for database schema documentation

---

## 📝 License

ISC

---

**Last Updated:** May 4, 2024
