import { ethers } from 'ethers';
import { config } from '../config';

// XFT Token ABI (only the functions we need)
const XFT_ABI = [
  // Read functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  
  // Write functions
  'function transfer(address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private decimals: number = 18; // Default, will be updated in constructor

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.contract = new ethers.Contract(
      config.contractAddress,
      XFT_ABI,
      this.provider
    );
    
    // Initialize decimals
    this.initDecimals();
  }

  private async initDecimals(): Promise<void> {
    try {
      this.decimals = await this.contract.decimals();
    } catch (error) {
      console.error('Failed to get token decimals, using default (18):', error);
    }
  }

  // Get token balance for an address
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.utils.formatUnits(balance, this.decimals);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to fetch balance from blockchain');
    }
  }

  // Verify signature to authenticate user
  async verifySignature(address: string, message: string, signature: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  // Generate a random nonce for authentication
  generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  // Create a message for signing
  createSignMessage(address: string, nonce: string): string {
    return `Sign this message to authenticate with XFT App: ${nonce}`;
  }
}

// Create and export a singleton instance
export const blockchain = new BlockchainService(); 