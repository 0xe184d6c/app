import fs from 'fs';
import path from 'path';
import { config } from '../config';

// Simple file-based storage instead of using a database
export class Storage {
  private basePath: string;

  constructor(storagePath: string = config.dataDir) {
    this.basePath = storagePath;
    this.ensureDirectoryExists();
  }

  // Ensure the data directory exists
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  // Get the path to a collection file
  private getCollectionPath(collection: string): string {
    return path.join(this.basePath, `${collection}.json`);
  }

  // Read an entire collection or a specific item by ID
  async read<T>(collection: string, id?: string): Promise<T | T[] | null> {
    const collectionPath = this.getCollectionPath(collection);
    
    if (!fs.existsSync(collectionPath)) {
      return id ? null : [];
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8')) as T[];
      
      if (id) {
        const item = data.find((item: any) => item.id === id);
        return item || null;
      }
      
      return data;
    } catch (error) {
      console.error(`Error reading from ${collection}:`, error);
      return id ? null : [];
    }
  }

  // Write an entire collection
  async write<T>(collection: string, data: T[]): Promise<T[]> {
    const collectionPath = this.getCollectionPath(collection);
    
    try {
      fs.writeFileSync(collectionPath, JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error(`Error writing to ${collection}:`, error);
      throw error;
    }
  }

  // Create or update an item in a collection
  async save<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const collectionPath = this.getCollectionPath(collection);
    let data: T[] = [];
    
    if (fs.existsSync(collectionPath)) {
      try {
        data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
      } catch (error) {
        console.error(`Error reading from ${collection}:`, error);
      }
    }
    
    const index = data.findIndex((existingItem: any) => existingItem.id === item.id);
    
    if (index !== -1) {
      // Update existing item
      data[index] = item;
    } else {
      // Add new item
      data.push(item);
    }
    
    await this.write(collection, data);
    return item;
  }

  // Delete an item from a collection
  async delete<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
    const collectionPath = this.getCollectionPath(collection);
    
    if (!fs.existsSync(collectionPath)) {
      return false;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8')) as T[];
      const filteredData = data.filter((item: T) => item.id !== id);
      
      if (data.length === filteredData.length) {
        return false; // Item not found
      }
      
      await this.write(collection, filteredData);
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const storage = new Storage(); 