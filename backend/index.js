import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import adminAuthRoutes from './routes/adminAuth.js';
import adminExamRoutes from './routes/adminExams.js';
import publicExamRoutes from './routes/publicExams.js';
import verifyAdminToken from './middleware/verifyAdminToken.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// CORS — allow local dev + deployed Netlify frontend
// ========================
const allowedOrigins = [
  'http://localhost:5173',
  'https://dotcomputersurge.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ========================
// PERFORMANCE — gzip compression reduces response sizes by ~70%
// Critical for Render free tier (slow network)
// ========================
app.use(compression());

// ========================
// SECURITY — rate limiting prevents abuse on free tier
// 100 requests per minute per IP (generous for 40 users)
// ========================
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 100,               // 100 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in a minute.' },
});
app.use('/api', limiter);

// ========================
// BODY PARSER
// ========================
app.use(express.json({ limit: '2mb' }));

// ========================
// ROUTES
// ========================
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', verifyAdminToken, adminExamRoutes);
app.use('/api/exams', publicExamRoutes);

// ========================
// HEALTH CHECK — keep Render from sleeping + uptime monitors
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

// Render-specific: respond to root with a simple message
app.get('/', (req, res) => {
  res.json({ success: true, message: '.computer Quiz API is running.' });
});

// ========================
// ERROR HANDLER (must be last)
// ========================
app.use(errorHandler);

// ========================
// MONGODB + SERVER START
// Optimized connection settings for free MongoDB Atlas + Render
// ========================
const mongoOptions = {
  maxPoolSize: 10,           // Enough for 40 concurrent users
  serverSelectionTimeoutMS: 10000,  // 10s timeout (Render cold starts are slow)
  socketTimeoutMS: 45000,    // Close sockets after 45s inactivity
  bufferCommands: true,      // Buffer commands while connecting
};

mongoose
  .connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

export default app;
