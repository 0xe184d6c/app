import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        address: string;
      };
    }
  }
}

// Middleware to authenticate using JWT
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No authentication token provided'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; address: string };
    
    // Add user data to request
    req.user = {
      id: decoded.id,
      address: decoded.address
    };
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token'
    });
  }
};

// Generate JWT token for a user
export const generateToken = (userId: string, address: string): string => {
  return jwt.sign(
    { id: userId, address },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}; 