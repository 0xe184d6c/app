import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../storage';
import { blockchain } from '../services/blockchain';
import { Transaction, TransactionStatus, TransactionType } from '../models/types';

// Get user's transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Get all transactions
    const allTransactions = await storage.read<Transaction>('transactions');
    
    // Filter for user's transactions
    const transactions = (Array.isArray(allTransactions) ? allTransactions : [])
      .filter(tx => tx.userId === req.user!.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return res.status(200).json({
      success: true,
      data: {
        transactions
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

// Create a new transaction (send tokens)
export const createTransaction = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    const { recipient, amount } = req.body;
    
    if (!recipient || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Recipient address and amount are required'
      });
    }
    
    // In a real app, you would connect to the user's wallet or a relayer service
    // to create and send the transaction on-chain
    // For this demo, we'll just record the transaction in our storage
    
    const transaction: Transaction = {
      id: uuidv4(),
      userId: req.user.id,
      type: TransactionType.SEND,
      amount,
      from: req.user.address,
      to: recipient,
      status: TransactionStatus.PENDING,
      timestamp: new Date().toISOString()
    };
    
    await storage.save('transactions', transaction);
    
    return res.status(201).json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
};

// Get a specific transaction
export const getTransaction = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }
    
    const transaction = await storage.read<Transaction>('transactions', id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    // Check if transaction belongs to user
    if ((transaction as Transaction).userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to access this transaction'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
}; 