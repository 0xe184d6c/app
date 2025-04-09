import express from 'express';
import { login, getNonce } from '../controllers/auth';

const router = express.Router();

// Login with wallet signature
router.post('/login', login);

// Get nonce for signature
router.get('/nonce/:address', getNonce);

export const authRoutes = router; 