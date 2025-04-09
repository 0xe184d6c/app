# XFT App

A minimal web application for interacting with XFT tokens on the Ethereum blockchain.

## Overview

XFT App is built with a headless backend API and vanilla HTML/TypeScript frontend, allowing users to:

- Connect their Ethereum wallet (MetaMask)
- View their XFT token balance
- Transfer tokens to other addresses
- View transaction history

## Architecture

### Backend

The backend is a RESTful API built using:

- Node.js with Express
- TypeScript
- File-based storage (no database)
- JWT authentication
- Ethereum integration via ethers.js

### Frontend

The frontend is a vanilla web application using:

- HTML, CSS, and TypeScript
- Parcel bundler
- ethers.js for blockchain integration
- No frameworks or libraries

## Setup

### Prerequisites

- Node.js 14+
- Ethereum wallet (MetaMask)
- Access to Ethereum Sepolia testnet

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `RPC_URL` with your Ethereum provider URL
   - Update `CONTRACT_ADDRESS` with the XFT token contract address

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser to http://localhost:1234

## API Endpoints

### Authentication
- `GET /api/v1/auth/nonce/:address` - Get a nonce for wallet signature
- `POST /api/v1/auth/login` - Authenticate with wallet signature

### Users
- `GET /api/v1/users/:address` - Get user profile
- `GET /api/v1/users/:address/balance` - Get token balance

### Transactions
- `GET /api/v1/transactions` - List transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/:id` - Get transaction details

## Production Deployment

1. Build the backend:
   ```
   cd backend && npm run build
   ```

2. Build the frontend:
   ```
   cd frontend && npm run build
   ```

3. Deploy the backend to your server
4. Deploy the frontend static files to a web server or CDN

## Security Considerations

For production:
- Use a real database like PostgreSQL
- Implement rate limiting
- Add proper error logging
- Configure CORS properly
- Update JWT secret in .env
- Configure TLS/HTTPS

## License

ISC License 