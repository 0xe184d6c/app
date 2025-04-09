// User model
export interface User {
  id: string;
  address: string;
  nonce: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction model
export enum TransactionType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: string;
  from: string;
  to: string;
  hash?: string;
  status: TransactionStatus;
  timestamp: string;
}

// Auth types
export interface AuthRequest {
  address: string;
  signature: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 