import { Transaction } from './api';

// UI utility functions
export class UI {
  // Format address for display (0x1234...5678)
  public formatAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  // Format date for display
  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  
  // Show success message
  public showSuccess(message: string, duration: number = 3000): void {
    const container = document.getElementById('success-container');
    if (!container) return;
    
    container.textContent = message;
    container.classList.remove('hidden');
    
    setTimeout(() => {
      container.classList.add('hidden');
    }, duration);
  }
  
  // Show error message
  public showError(message: string, duration: number = 3000): void {
    const container = document.getElementById('error-container');
    if (!container) return;
    
    container.textContent = message;
    container.classList.remove('hidden');
    
    setTimeout(() => {
      container.classList.add('hidden');
    }, duration);
  }
  
  // Update wallet display
  public updateWalletDisplay(address: string | null): void {
    const connectButton = document.getElementById('connect-wallet');
    const walletInfo = document.getElementById('wallet-info');
    const addressElement = document.getElementById('wallet-address');
    
    if (address) {
      // Show connected wallet
      connectButton?.classList.add('hidden');
      walletInfo?.classList.remove('hidden');
      
      if (addressElement) {
        addressElement.textContent = this.formatAddress(address);
      }
    } else {
      // Show connect button
      connectButton?.classList.remove('hidden');
      walletInfo?.classList.add('hidden');
    }
  }
  
  // Update balance display
  public updateBalance(balance: string): void {
    const balanceElement = document.getElementById('balance-display');
    if (balanceElement) {
      balanceElement.textContent = `${balance} XFT`;
    }
  }
  
  // Render transaction list
  public renderTransactions(transactions: Transaction[]): void {
    const listElement = document.getElementById('transactions-list');
    const noTransactionsElement = document.getElementById('no-transactions');
    
    if (!listElement || !noTransactionsElement) return;
    
    if (!transactions.length) {
      listElement.classList.add('hidden');
      noTransactionsElement.classList.remove('hidden');
      return;
    }
    
    // Show transactions
    listElement.classList.remove('hidden');
    noTransactionsElement.classList.add('hidden');
    
    // Clear list
    listElement.innerHTML = '';
    
    // Add each transaction
    transactions.forEach(tx => {
      const item = document.createElement('div');
      item.className = 'transaction-item';
      
      const header = document.createElement('div');
      header.className = 'transaction-header';
      
      const type = document.createElement('span');
      type.className = 'transaction-type';
      type.textContent = tx.type;
      
      const amount = document.createElement('span');
      amount.className = 'transaction-amount';
      amount.textContent = `${tx.amount} XFT`;
      
      header.appendChild(type);
      header.appendChild(amount);
      
      const details = document.createElement('div');
      details.className = 'transaction-details';
      
      const address = document.createElement('span');
      address.textContent = tx.type === 'SEND' ? `To: ${this.formatAddress(tx.to)}` : `From: ${this.formatAddress(tx.from)}`;
      
      const date = document.createElement('span');
      date.textContent = this.formatDate(tx.timestamp);
      
      details.appendChild(address);
      details.appendChild(date);
      
      item.appendChild(header);
      item.appendChild(details);
      
      listElement.appendChild(item);
    });
  }
}

// Create a single instance to be used throughout the app
export const ui = new UI(); 