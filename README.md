# CMA Point - E-Commerce Website

A modern e-commerce platform built with React, Node.js, and MongoDB.

## Features
- Product catalog with search and filtering
- Shopping cart functionality
- User authentication and profiles
- Order management
- Payment integration with Stripe
- Admin dashboard
- Responsive design
- Order tracking

## Tech Stack
- **Frontend**: React 18, Redux, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Stripe
- **Additional**: Bcrypt for password hashing, Validator

## Project Structure
```
cma-point/
├── frontend/           # React frontend application
│   ├── public/        # Static files
│   ├── src/           # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store.js      # Redux store
│   │   └── App.js        # Main App component
│   └── package.json
├── backend/           # Express.js backend API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── config/        # Configuration files
│   ├── server.js      # Main server file
│   └── package.json
├── docs/             # Documentation
└── package.json      # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mukeshagarwal32100-prog/cma-point.git
cd cma-point
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB URL, JWT secret, and Stripe keys

4. **Start development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`
Backend API will be available at: `http://localhost:5000`

## Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

## API Documentation

See [API.md](docs/API.md) for detailed API documentation.

## Setup Guide

See [SETUP.md](docs/SETUP.md) for detailed setup instructions.

## License

ISC
