import { ethers } from 'ethers';
import { api } from './api';

// Wallet connection service
export class WalletService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private address: string | null = null;
  
  // Check if MetaMask is installed
  public isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }
  
  // Get the connected address
  public getAddress(): string | null {
    return this.address;
  }
  
  // Check if wallet is connected
  public isConnected(): boolean {
    return !!this.address;
  }
  
  // Connect to MetaMask
  public async connect(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      // Create provider
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request accounts from MetaMask
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      // Set address and create signer
      this.address = accounts[0];
      this.signer = this.provider.getSigner();
      
      return this.address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }
  
  // Disconnect wallet
  public disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.address = null;
    api.clearToken();
  }
  
  // Sign a message
  public async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('Failed to sign message');
    }
  }
  
  // Get nonce and authenticate
  public async authenticate(): Promise<void> {
    if (!this.address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Get nonce
      const { message } = await api.getNonce(this.address);
      
      // Sign message
      const signature = await this.signMessage(message);
      
      // Authenticate with API
      await api.authenticate(this.address, signature);
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Failed to authenticate');
    }
  }
}

// Create a single instance to be used throughout the app
export const wallet = new WalletService();

// Declare ethereum global for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
} 