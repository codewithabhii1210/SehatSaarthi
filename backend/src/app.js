require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./utils/errorHandler');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const healthWorkerRoutes = require('./routes/healthWorkerRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const immunizationRoutes = require('./routes/immunizationRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const referralRoutes = require('./routes/referralRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const cacheMiddleware = require('./middleware/cacheMiddleware');

const app = express();
const server = http.createServer(app);

// Socket.io is a progressive enhancement: on Vercel serverless there is no
// persistent WebSocket, so emit() is a no-op and every REST route still works.
let io = null;
try {
  io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
  io.on('connection', (socket) => {
    socket.on('join', (room) => socket.join(room));
  });
} catch (e) {
  io = { emit() {}, to() { return this; } };
}
app.set('io', io);

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'SehatSaarthi Backend', timestamp: new Date() })
);

// Connect lazily + once, and warm the login cache. These MUST be registered
// before the routes: Express skips middleware that is mounted after the
// matching route, which would leave requests buffering on an unconnected driver.
let connected = false;
let connecting = null;
const ensureDb = async () => {
  if (connected) return;
  if (!connecting) connecting = connectDB().then(() => { connected = true; }).catch((e) => {
    connecting = null;
    throw e;
  });
  return connecting;
};

let warmed = false;
let warming = null;
const warmup = async () => {
  if (warmed || !connected) return;
  if (!warming) warming = (async () => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const { userCache } = require('./controllers/authController');
    const users = await User.find({}).select('+password').lean();
    const KNOWN = ['123456', 'password', 'admin123', 'doctor123', 'asha123'];
    for (const u of users) {
      const entry = {
        _id: u._id, name: u.name, email: u.email, phone: u.phone,
        role: u.role, abhaId: u.abhaId, profileImage: u.profileImage, password: u.password,
      };
      for (const pass of KNOWN) {
        if (await bcrypt.compare(pass, u.password)) { entry._plain = pass; break; }
      }
      userCache.set(u.email.toLowerCase(), entry);
      if (u.phone) userCache.set(u.phone, entry);
    }
    warmed = true;
    console.log(`User cache warmed: ${users.length} users loaded`);
  })().catch((e) => { warming = null; console.log('Warmup error:', e.message); });
  return warming;
};

app.use(async (req, res, next) => {
  try {
    await ensureDb();
    await warmup();
    next();
  } catch (e) {
    next(e);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/patient', cacheMiddleware(10000), patientRoutes);
app.use('/api/health-worker', cacheMiddleware(10000), healthWorkerRoutes);
app.use('/api/doctor', cacheMiddleware(10000), doctorRoutes);
app.use('/api/admin', cacheMiddleware(10000), adminRoutes);
app.use('/api/patient', immunizationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/treatment', treatmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app, server };
