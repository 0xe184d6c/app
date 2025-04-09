import express from 'express';
import { getUser, getBalance } from '../controllers/users';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get user profile (requires authentication)
router.get('/:address', authenticate, getUser);

// Get user's token balance (public)
router.get('/:address/balance', getBalance);

export const userRoutes = router; 