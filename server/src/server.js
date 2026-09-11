const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, getStoreStatus } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline voice blob workers & external CDNs/fonts
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit login / register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body Parser with 10MB limit for secure file/audio payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & Root Status Endpoints (For Render & Vercel health monitoring)
app.get('/', (req, res) => {
  const status = getStoreStatus();
  res.json({
    status: 'online',
    message: 'Smart Placement Portal API Service',
    database: status.isConnected ? 'MongoDB Atlas Connected' : 'Fallback Store Active',
    version: '1.0.0',
    endpoints: '/api/health',
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  const status = getStoreStatus();
  res.json({
    status: 'healthy',
    name: 'Smart Placement Portal API',
    version: '1.0.0',
    database: status.isConnected ? 'MongoDB Connected' : 'Resilient In-Memory/Mock Store Active',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Smart Placement Portal] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
