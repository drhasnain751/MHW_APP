import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB, { sequelize } from './config/db.js';

// Import models to ensure they are registered before sync
import './models/User.js';
import './models/MoodLog.js';
import './models/TherapySession.js';
import './models/Assessment.js';
import './models/WellnessContent.js';
import './models/JournalEntry.js';
import './models/Message.js';

import userRoutes from './routes/userRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import therapyRoutes from './routes/therapyRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware to ensure DB connection
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      await sequelize.sync();
      isConnected = true;
      console.log('Database initialized');
    } catch (err) {
      console.error('DB Init Error:', err);
    }
  }
  next();
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/therapy', therapyRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/messages', messageRoutes);

// Basic Route for testing
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Mental Health & Wellness API' });
});

// Error handling fallback
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

export default app;

