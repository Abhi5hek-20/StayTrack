import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import userAuthRoutes from './routes/user/auth.route.js'; 
import complaintRoutes from './routes/user/complaint.route.js';
import logbookRoutes from './routes/user/logbook.route.js';
import contactRoutes from './routes/user/contact.route.js';
import userNotificationRoutes from './routes/user/notification.route.js';
import userAnnouncementRoutes from './routes/user/announcement.route.js';
import adminAuthRoutes from './routes/admin/adminAuth.route.js';
import adminDashboardRoutes from './routes/admin/dashboard.route.js';
import adminComplaintRoutes from './routes/admin/adminComplaint.route.js';
import adminProfileRoutes from './routes/admin/adminProfile.route.js';
import adminAnnouncementRoutes from './routes/admin/announcement.route.js';
import adminNotificationRoutes from './routes/admin/adminNotification.route.js';
import adminPaymentHandleRoutes from './routes/admin/adminpaymentHandle.route.js';
import checkAuthRoutes from './routes/auth.route.js';
import paymentRoutes from './routes/user/payment.route.js';


dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Make io available globally
global.io = io;

// CORS configuration
app.use(cors({
  origin: NODE_ENV === "development" ? ['http://localhost:5173', 'http://localhost:5174'] : process.env.CLIENT_URL, // Support both ports in development, use CLIENT_URL in production
  credentials: true, // Allow cookies to be sent
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/check-auth", checkAuthRoutes); // check who is logged in global route
// User Routes
app.use("/api/user", userAuthRoutes); // login, signup, logout, update profile, change password
app.use("/api/user/contact", contactRoutes); 
app.use("/api/user/notifications", userNotificationRoutes);
app.use("/api/user/announcements", userAnnouncementRoutes);
app.use("/api/complaints", complaintRoutes); 
app.use("/api/logbook", logbookRoutes); 
app.use("/api/user/payments", paymentRoutes); // make payment route

// Admin Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/admin/announcements", adminAnnouncementRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/payments", adminPaymentHandleRoutes); // Admin payment handling routes

// Socket.io connection handling
io.on('connection', (socket) => {
  // Join user to their room for targeted notifications
  socket.on('join-user', (userId) => {
    console.log(`User connected to socket: ${userId}`);
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  // Join admin to admin room
  socket.on('join-admin', (adminId) => {
    console.log(`admin connected to socket: ${adminId}`);
    if (adminId) {
      const roomName = `admin_${adminId}`;
      socket.join(roomName);
      socket.join('admin_admin'); // Join general admin room
    }
  });

  socket.on('disconnect', () => {
    // Handle disconnect
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
