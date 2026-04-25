const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const morgan     = require('morgan');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const moduleRoutes   = require('./routes/modules');
const taskRoutes     = require('./routes/tasks');
const sessionRoutes  = require('./routes/sessions');
const statsRoutes    = require('./routes/stats');

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/modules',  moduleRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats',    statsRoutes);

// ── Health check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nexus Study API running' });
});

// ── Error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Connect MongoDB & Start ───────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
