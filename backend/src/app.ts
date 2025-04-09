import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { txRoutes } from './routes/transactions';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/transactions', txRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
}); 