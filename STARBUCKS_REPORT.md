# Starbucks Project - Complete Technical Report

## Executive Summary

The Starbucks project is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). The application provides customers with a menu browsing and ordering system, and administrators with complete product, category, and order management capabilities.

---

## Project Overview

Repository: Slim-Hady/starbucks 
GitHub: https://github.com/Slim-Hady/starbucks
Project Type: Full-Stack E-Commerce Application


### Architecture

- Frontend: React + Vite (Modern SPA)
- Backend: Express.js + TypeScript (REST API)
- Database: MongoDB Atlas
- Authentication: JWT (JSON Web Tokens) + bcryptjs
- Payment Processing: Stripe Integration
- Deployment: Docker + Multi-platform (Render, Vercel, Cloud)

---

## Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | Latest | Runtime Environment |
| Express.js | 5.2.1 | Web Framework |
| TypeScript | 6.0.3 | Type Safety |
| MongoDB | Atlas | NoSQL Database |
| Mongoose | 9.6.0 | MongoDB ODM |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Stripe | 22.1.0 | Payment Processing |
| Nodemailer | 8.0.7 | Email Notifications |
| Morgan | 1.10.1 | HTTP Logging |
| CORS | 2.8.6 | Cross-Origin Support |
| Swagger | 6.2.8 | API Documentation |
| Jest | 30.3.0 | Unit Testing |
| Supertest | 7.2.2 | API Testing |

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI Library |
| React Router | Latest | Client-Side Routing |
| Vite | Latest | Build Tool |
| TailwindCSS | Latest | Utility-First CSS |
| PostCSS | Latest | CSS Processing |
| ESLint | Latest | Code Quality |

### Development Tools

| Tool | Purpose |
|------|---------|
| Jest | Unit Testing |
| Supertest | API Testing |
| Nodemon | Development Server Watch |
| ts-node | TypeScript Execution |
| Docker | Containerization |

---

## Project Structure and Statistics

### File Organization

```
starbucks/
├── src/                          Backend Source (27 TypeScript files)
│   ├── controller/              Business Logic (7 files)
│   ├── models/                  Database Schemas (4 files)
│   ├── routes/                  API Routes (6 files)
│   ├── middleware/              Express Middleware (2 files)
│   ├── data/                    Data Management (2 files)
│   └── utils/                   Utility Functions (4 files)
├── client/src/                  Frontend Source (25 JavaScript/JSX files)
│   ├── components/              Reusable React Components (6 files)
│   ├── pages/                   Page Components (8 files)
│   ├── context/                 React Context (2 files)
│   ├── hooks/                   Custom React Hooks (1 file)
│   ├── services/                API Service Layer (1 file)
│   └── data/                    Static Data (3 files)
├── test/                         Test Suite
└── Configuration Files          Docker, Webpack, TypeScript, etc.
```

### Statistics

- Total Source Files: 76 (excluding node_modules)
- Backend TypeScript Files: 27
- Frontend JavaScript/JSX Files: 25
- Test Files: Included in test directory
- Configuration Files: 15+

---

## Core Features Implemented

### 1. User Management

- User Registration and Login
- JWT-based Authentication
- Role-based Access Control
- Password Hashing with bcryptjs
- User Profile Management

### 2. Product Management

- CRUD Operations for Products
- Product Catalog with Images
- Category Classification
- Product Availability Status
- Alphabetical Sorting (A-Z / Z-A) - NEW
- Search Functionality

### 3. Category Management

- Dynamic Category Creation
- Category Organization
- Alphabetical Sorting (A-Z / Z-A) - NEW

### 4. Shopping Cart

- Add/Remove Items
- Real-time Cart Updates
- Cart Context Management
- Persistent Cart State

### 5. Order Management

- Order Creation and Tracking
- Order History
- Order Status Management
- Admin Order Dashboard

### 6. Payment Integration

- Stripe Payment Gateway
- Secure Payment Processing
- Transaction History

### 7. Email Notifications

- User Registration Confirmation
- Order Notifications
- Nodemailer Integration

### 8. Admin Dashboard

- Comprehensive Admin Panel
- Product Management Interface
- Category Management Interface
- Order Management Interface
- User Activity Monitoring

### 9. Search and Filtering

- Product Search Bar
- Category Filtering
- Alphabetical Sorting on Menu

---

## Database Schema

### User Model

- _id: ObjectId
- name: String (required)
- email: String (required, unique)
- password: String (hashed)
- role: String (Admin/Customer)
- createdAt: Date
- updatedAt: Date

### Product Model

- _id: ObjectId
- name: String (required)
- description: String
- price: Number (required)
- category: String (reference)
- image: String (URL)
- isAvailable: Boolean
- createdAt: Date
- updatedAt: Date

### Category Model

- _id: ObjectId
- name: String (required, unique)
- description: String
- createdAt: Date
- updatedAt: Date

### Order Model

- _id: ObjectId
- user: ObjectId (reference)
- items: Array of ordered items
- totalPrice: Number
- status: String (Pending/Processing/Completed)
- paymentMethod: String
- createdAt: Date
- updatedAt: Date

---

## API Endpoints

### Authentication Routes (/api/v1/auth)

- POST /register - Register new user
- POST /login - User login
- POST /logout - User logout
- POST /refresh - Refresh JWT token

### Product Routes (/api/v1/products)

- GET / - Get all products (with alphabetical sorting)
- GET /:id - Get product details
- POST / - Create product (Admin)
- PATCH /:id - Update product (Admin)
- DELETE /:id - Delete product (Admin)

### Category Routes (/api/v1/categories)

- GET / - Get all categories (with alphabetical sorting)
- POST / - Create category (Admin)
- PATCH /:id - Update category (Admin)
- DELETE /:id - Delete category (Admin)

### Order Routes (/api/v1/orders)

- GET / - Get all orders (Admin) / user orders (Customer)
- GET /:id - Get order details
- POST / - Create order
- PATCH /:id - Update order status (Admin)

### User Routes (/api/v1/users)

- GET / - Get all users (Admin)
- GET /:id - Get user profile
- PATCH /:id - Update user profile
- DELETE /:id - Delete user (Admin)

### Payment Routes (/api/v1/payment)

- POST /create-checkout - Create Stripe checkout session
- POST /webhook - Stripe webhook handling

---

## Alphabetical Sorting Implementation

### Changes Made

#### 1. Admin Products Page (client/src/pages/admin/Products.jsx)

- Added sortOrder state variable (default: 'asc')
- Added sort dropdown control with options: "A-Z" and "Z-A"
- Implemented sorting logic using localeCompare() for alphabetical ordering
- Products sorted before rendering in admin table

#### 2. Customer Menu Page (client/src/pages/Menu.jsx)

- Added sortOrder state variable (default: 'asc')
- Added sort dropdown control integrated with category filter
- Implemented sorting in filtered products pipeline
- Responsive design with proper spacing on mobile/desktop

#### 3. Categories Management Page (client/src/pages/admin/Categories.jsx)

- Added sortOrder state variable (default: 'asc')
- Added sort dropdown control in header section
- Implemented sorting logic for categories grid
- Categories sorted alphabetically before rendering

### Technical Implementation Details

Sorting Algorithm:

```javascript
const sorted = [...items].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
});
```

Key Features:

- Locale-aware alphabetical sorting
- Case-insensitive comparison
- Supports both ascending (A-Z) and descending (Z-A) order
- Real-time sorting without re-fetching data
- Responsive UI controls
- Consistent implementation across all pages

---

## NPM Scripts

### Backend Scripts

```bash
npm run dev              # Start development server (Nodemon)
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run test             # Run all tests
npm run test:watch      # Run tests in watch mode
npm run seed            # Seed database with initial data
npm run data            # Data management utilities
npm run data:import    # Import data
npm run data:update    # Update data
npm run data:delete    # Delete data
npm run data:deleteAll # Delete all data
```

### Frontend Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

---

## Deployment Options

### 1. Docker Deployment (All-in-One)

```bash
docker-compose up --build -d
# Access at http://localhost
```

### 2. Cloud Deployment (Vercel + Render)

Frontend: Deployed on Vercel
Backend: Deployed on Render
Database: MongoDB Atlas (Free Tier)
CDN: Vercel Global CDN

### 3. Environment Configuration

Backend:

```env
DATABASE=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-frontend.vercel.app
PORT=3002
STRIPE_SECRET_KEY=sk_...
```

Frontend:

```env
VITE_API_URL=https://starbucks-backend.onrender.com/api/v1
```

---

## Security Implementations

- Authentication: JWT-based with refresh tokens
- Password Security: Hashed with bcryptjs
- Authorization: Role-based access control (RBAC)
- CORS: Configured for cross-origin requests
- Error Handling: Centralized error middleware
- Environment Variables: Sensitive data in .env
- Input Validation: Data validation on routes
- Payment Security: Stripe secure payment processing

---

## Performance Optimizations

- Vite Build Tool: Fast module bundling
- React Hooks: Efficient state management
- Context API: Global state without Redux overhead
- Lazy Loading: Code splitting and dynamic imports
- Image Optimization: Placeholder fallback for images
- Database Indexing: Mongoose indexing on frequently queried fields

---

## UI and UX Design

### Design System

- Color Scheme: Starbucks Green (#00704A), Cream, Dark
- Typography: Bold headings, readable body text
- Components: Card-based layout, modal dialogs
- Responsiveness: Mobile-first responsive design
- Accessibility: Semantic HTML, ARIA labels

### Pages

1. Home - Landing page with hero section
2. Menu - Product browsing with filters and sorting
3. Product Detail - Individual product information
4. Cart - Shopping cart sidebar
5. Checkout - Stripe payment integration
6. Login/Signup - Authentication pages
7. Rewards - Loyalty program page
8. Admin Dashboard - Overview and management hub
9. Products Management - CRUD operations with sorting
10. Categories Management - CRUD operations with sorting
11. Orders Management - Order tracking and status updates

---

## Recent Git History

```
dfec49c - fix create account
2c79a8c - final edits
8165731 - feat: integrate backend with front end
0c25576 - feat: Add front end
67e82c0 - feat: Add more tests
d355a03 - Add complete Starbucks backend
a823dd3 - feat: Add CRUD for products, categories, Orders
ec0f2b1 - feat: Add files
4946339 - generated code for adding json data to mongoDB
7958b66 - feat: Add user CRUD
d8729b9 - feat: Add user schema, getAllUser API and init routes
8827685 - feat: Add user schema and database connection
44df68a - feat: Add User Schema
4a131ab - init: add project skeleton
4910ba7 - Update README.md
b598619 - Update README.md
ad9ca2f - feat: Add schema and system flow diagrams
a56d274 - init: init the project structure
0e6fe33 - init: init the project structure
381561f - Update README.md
```

---

## Documentation Files

- README.md - Quick start guide and setup instructions
- DEPLOY.md - Comprehensive deployment instructions
- client/README.md - Frontend setup guide
- src/models/README.md - Database models documentation
- src/routes/README.md - API routes documentation
- src/controller/README.md - Controller documentation
- src/data/README.md - Data management guide
- test/README.md - Testing documentation

---

## Development Workflow

### Setup

Backend:

```bash
npm install
npx tsc --init
npm run build
npm run dev
```

Frontend (in client directory):

```bash
npm install
npm run dev
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

### Seeding Database

```bash
npm run seed          # Seed with initial data
```

---

## Summary of Accomplishments

### Core Functionality

- Full MERN stack implementation
- User authentication and authorization
- Product and Category management
- Shopping cart functionality
- Order management system
- Stripe payment integration
- Admin dashboard
- Email notifications
- Search functionality

### Quality Assurance

- Jest testing framework
- API testing with Supertest
- TypeScript type safety
- Error handling middleware
- Input validation

### Deployment

- Docker containerization
- Multi-platform deployment
- Environment configuration
- Database connection pooling

### Recent Enhancement

Alphabetical Sorting implemented on:

- Products (Admin and Customer)
- Categories
- Real-time sorting without API calls
- Responsive UI controls

---

## Project Statistics Summary

Repository: Slim-Hady/starbucks
Project Type: Full-Stack E-Commerce (MERN)
Total Project Size: 76 source files, 27 backend modules, 25 frontend components

Backend Composition:
- Controllers: 7 files (User, Product, Category, Order, Auth, Payment)
- Models: 4 files (User, Product, Category, Order)
- Routes: 6 files (Auth, Product, Category, Order, User, Payment)
- Middleware: 2 files (Authentication, Error handling)
- Utils: 4 files (APIFeature, AppError, catchAsync, Email)
- Services: 2 files (Server, Swagger, Data manager)

Frontend Composition:
- Pages: 8 files (Home, Menu, Cart, Product Detail, Login, Signup, Rewards, Admin views)
- Components: 6 files (DrinkCard, Navbar, Footer, SearchBar, CartSidebar, etc)
- Context: 2 files (AuthContext, CartContext)
- Hooks: 1 file (useCart)
- Services: 1 file (API client)
- Data: 3 files (categories, menuItems, rewards)

