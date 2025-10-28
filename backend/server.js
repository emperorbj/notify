import express from 'express';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes.js';
import dotenv from "dotenv"
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: '*'
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/notes', noteRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Note-taking API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});