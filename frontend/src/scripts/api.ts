// API client for backend communication

// Types
interface User {
  id: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface NonceResponse {
  nonce: string;
  message: string;
}

interface Transaction {
  id: string;
  type: 'SEND' | 'RECEIVE';
  amount: string;
  from: string;
  to: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  
  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
    this.loadToken();
  }
  
  // Load token from localStorage
  private loadToken(): void {
    this.token = localStorage.getItem('auth_token');
  }
  
  // Save token to localStorage
  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  // Clear token
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  
  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.token;
  }
  
  // Make API request with appropriate headers
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data.data;
  }
  
  // Get nonce for a wallet address
  async getNonce(address: string): Promise<NonceResponse> {
    return this.request<NonceResponse>(`/auth/nonce/${address}`);
  }
  
  // Authenticate with address and signature
  async authenticate(address: string, signature: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ address, signature })
    });
    
    this.saveToken(data.token);
    return data;
  }
  
  // Get balance for an address
  async getBalance(address: string): Promise<{ address: string; balance: string }> {
    return this.request<{ address: string; balance: string }>(`/users/${address}/balance`);
  }
  
  // Get transaction history
  async getTransactions(): Promise<{ transactions: Transaction[] }> {
    return this.request<{ transactions: Transaction[] }>('/transactions');
  }
  
  // Create a new transaction
  async createTransaction(recipient: string, amount: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>('/transactions', {
      method: 'POST',
      body: JSON.stringify({ recipient, amount })
    });
  }
}

// Create a single instance to be used throughout the app
export const api = new ApiClient(); 