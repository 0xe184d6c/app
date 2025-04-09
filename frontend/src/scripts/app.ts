import { api } from './api';
import { wallet } from './wallet';
import { ui } from './ui';

// Main application class
class App {
  // Initialize the application
  public async init(): Promise<void> {
    this.attachEventListeners();
    
    // Check if wallet is already connected (via stored token)
    if (api.isAuthenticated()) {
      await this.connectWallet();
    }
  }
  
  // Set up event listeners
  private attachEventListeners(): void {
    // Connect wallet button
    const connectButton = document.getElementById('connect-wallet');
    connectButton?.addEventListener('click', async () => {
      await this.connectWallet();
    });
    
    // Disconnect wallet button
    const disconnectButton = document.getElementById('disconnect-wallet');
    disconnectButton?.addEventListener('click', () => {
      this.disconnectWallet();
    });
    
    // Transfer form
    const transferForm = document.getElementById('transfer-form') as HTMLFormElement;
    transferForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleTransfer(transferForm);
    });
  }
  
  // Connect wallet
  private async connectWallet(): Promise<void> {
    try {
      // Check if MetaMask is installed
      if (!wallet.isMetaMaskInstalled()) {
        ui.showError('MetaMask is not installed. Please install MetaMask extension.');
        return;
      }
      
      // Connect MetaMask
      const address = await wallet.connect();
      
      // Authenticate with API
      await wallet.authenticate();
      
      // Update UI
      ui.updateWalletDisplay(address);
      
      // Load user data
      await this.loadUserData();
    } catch (error) {
      console.error('Connection error:', error);
      ui.showError('Failed to connect wallet. Please try again.');
    }
  }
  
  // Disconnect wallet
  private disconnectWallet(): void {
    wallet.disconnect();
    ui.updateWalletDisplay(null);
    ui.updateBalance('0');
    ui.renderTransactions([]);
  }
  
  // Load user data (balance and transactions)
  private async loadUserData(): Promise<void> {
    try {
      const address = wallet.getAddress();
      
      if (!address) {
        ui.showError('Wallet not connected');
        return;
      }
      
      // Get balance
      const balanceData = await api.getBalance(address);
      ui.updateBalance(balanceData.balance);
      
      // Get transactions
      if (api.isAuthenticated()) {
        const transactionsData = await api.getTransactions();
        ui.renderTransactions(transactionsData.transactions);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      ui.showError('Failed to load user data');
    }
  }
  
  // Handle transfer form submission
  private async handleTransfer(form: HTMLFormElement): Promise<void> {
    try {
      const recipientInput = form.elements.namedItem('recipient') as HTMLInputElement;
      const amountInput = form.elements.namedItem('amount') as HTMLInputElement;
      
      const recipient = recipientInput.value.trim();
      const amount = amountInput.value.trim();
      
      if (!recipient || !amount) {
        ui.showError('Please fill in both recipient address and amount');
        return;
      }
      
      // Create transaction
      await api.createTransaction(recipient, amount);
      
      // Clear form
      form.reset();
      
      // Show success message
      ui.showSuccess('Transaction submitted successfully');
      
      // Reload data
      await this.loadUserData();
    } catch (error) {
      console.error('Transfer error:', error);
      ui.showError('Failed to submit transaction. Please try again.');
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(console.error);
}); 