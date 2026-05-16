const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Models — আগে import করতে হবে
require('./models/Citizen');
require('./models/Payment'); 

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
app.use('/api/emergency', emergencyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart City Server চলছে! 🏙️' });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Database connect
const { connectPostgres } = require('./config/postgres');
const connectMongoDB = require('./config/mongodb');
connectPostgres();
connectMongoDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server চলছে port ${PORT} এ`));