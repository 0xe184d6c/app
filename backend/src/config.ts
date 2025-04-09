import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Default values for development if not provided in .env
const defaults = {
  PORT: '3000',
  JWT_SECRET: 'xft-dev-secret-key-change-in-production',
  RPC_URL: 'https://sepolia.infura.io/v3/your-infura-key',
  CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  DATA_DIR: path.resolve(__dirname, '../data')
};

export const config = {
  port: process.env.PORT || defaults.PORT,
  jwtSecret: process.env.JWT_SECRET || defaults.JWT_SECRET,
  rpcUrl: process.env.RPC_URL || defaults.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS || defaults.CONTRACT_ADDRESS,
  dataDir: process.env.DATA_DIR || defaults.DATA_DIR
};

// Check required config
const requiredConfigs: Array<keyof typeof config> = ['jwtSecret', 'rpcUrl', 'contractAddress'];

for (const key of requiredConfigs) {
  if (config[key] === undefined) {
    console.error(`Error: Required config "${key}" is missing`);
    process.exit(1);
  }
} 