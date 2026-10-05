require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/utils/db');

const authRoutes = require('./src/routes/auth');
const materialRoutes = require('./src/routes/materials');
const aiRoutes = require('./src/routes/ai');
const adminRoutes = require('./src/routes/admin');
const materialAiRoutes = require('./src/routes/materialAi');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'AI StudyBuddy API is running',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/materials', materialAiRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`AI StudyBuddy API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
