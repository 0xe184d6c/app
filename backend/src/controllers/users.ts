import { Request, Response } from 'express';
import { storage } from '../storage';
import { blockchain } from '../services/blockchain';
import { User } from '../models/types';

// Get user profile
export const getUser = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }
    
    // Check if this is the authenticated user or not
    if (req.user && req.user.address.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to access this profile'
      });
    }
    
    const user = await storage.read<User>('users', address);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Don't send the nonce to the client for security
    const { nonce, ...userData } = user as User;
    
    return res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

// Get user's token balance
export const getBalance = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }
    
    // Get balance from blockchain
    const balance = await blockchain.getBalance(address);
    
    return res.status(200).json({
      success: true,
      data: {
        address,
        balance
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch balance'
    });
  }
}; 