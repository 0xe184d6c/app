import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../storage';
import { blockchain } from '../services/blockchain';
import { generateToken } from '../middleware/auth';
import { User, AuthRequest } from '../models/types';

// Login/Authentication controller
export const login = async (req: Request, res: Response) => {
  try {
    const { address, signature }: AuthRequest = req.body;
    
    if (!address || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Address and signature are required'
      });
    }
    
    // Get or create user
    let user = await storage.read<User>('users', address);
    
    if (!user) {
      // First time user, create a new account
      const newUser: User = {
        id: address,
        address: address.toLowerCase(),
        nonce: blockchain.generateNonce(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      user = await storage.save('users', newUser);
      
      // For new users, allow login without signature verification
      const token = generateToken(user.id, user.address);
      
      return res.status(201).json({
        success: true,
        data: {
          token,
          user
        }
      });
    }
    
    // Ensure user is a single object, not an array
    const userObj = user as User;
    
    // Existing user - verify signature
    const message = blockchain.createSignMessage(address, userObj.nonce);
    const isValid = await blockchain.verifySignature(address, message, signature);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // Update nonce for security
    userObj.nonce = blockchain.generateNonce();
    userObj.updatedAt = new Date().toISOString();
    await storage.save('users', userObj);
    
    // Generate JWT token
    const token = generateToken(userObj.id, userObj.address);
    
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: userObj
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Get a new nonce for a wallet address
export const getNonce = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }
    
    // Get user or create one
    let user = await storage.read<User>('users', address);
    
    if (!user) {
      // Create a new user with a nonce
      const newUser: User = {
        id: address,
        address: address.toLowerCase(),
        nonce: blockchain.generateNonce(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      user = await storage.save('users', newUser);
    }
    
    // Ensure user is a single object, not an array
    const userObj = user as User;
    
    return res.status(200).json({
      success: true,
      data: {
        nonce: userObj.nonce,
        message: blockchain.createSignMessage(address, userObj.nonce)
      }
    });
  } catch (error) {
    console.error('Get nonce error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get authentication nonce'
    });
  }
}; 