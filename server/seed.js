// Run: node seed.js
// Creates demo admin and user accounts for testing

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-code-detector';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  detectionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  language: String,
  aiScore: Number,
  humanScore: Number,
  result: String,
  explanation: String,
  factors: Array,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ email: { $in: ['admin@demo.com', 'user@demo.com'] } });

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
      detectionCount: 42
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'Demo User',
      email: 'user@demo.com',
      password: userPassword,
      role: 'user',
      detectionCount: 15
    });

    // Seed some reports for demo user
    const sampleReports = [
      { userId: user._id, type: 'single', language: 'C++', aiScore: 80, humanScore: 20, result: 'Highly Likely AI Written', explanation: 'Generic naming, no comments, uniform structure.', createdAt: new Date(Date.now() - 86400000) },
      { userId: user._id, type: 'single', language: 'Python', aiScore: 35, humanScore: 65, result: 'Likely Human Written', explanation: 'Meaningful names, inline comments, domain logic.', createdAt: new Date(Date.now() - 172800000) },
      { userId: user._id, type: 'compare', language: 'Java', aiScore: 72, humanScore: 28, result: 'Likely AI Written', explanation: 'Consistent formatting, generic variable names.', createdAt: new Date(Date.now() - 259200000) },
      { userId: user._id, type: 'single', language: 'C', aiScore: 55, humanScore: 45, result: 'Uncertain', explanation: 'Mixed signals in code style.', createdAt: new Date(Date.now() - 345600000) },
      { userId: user._id, type: 'batch', language: 'Python', aiScore: 90, humanScore: 10, result: 'Highly Likely AI Written', explanation: 'Perfect structure, no personal style.', createdAt: new Date(Date.now() - 432000000) },
    ];

    await Report.insertMany(sampleReports);

    console.log('✅ Seeded demo accounts:');
    console.log('   Admin: admin@demo.com / admin123');
    console.log('   User:  user@demo.com  / user123');
    console.log('✅ Seeded 5 sample reports');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
