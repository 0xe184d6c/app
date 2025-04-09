import express from 'express';
import { getTransactions, createTransaction, getTransaction } from '../controllers/transactions';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

// Get user's transactions
router.get('/', getTransactions);

// Get a specific transaction
router.get('/:id', getTransaction);

// Create a new transaction
router.post('/', createTransaction);

export const txRoutes = router; 