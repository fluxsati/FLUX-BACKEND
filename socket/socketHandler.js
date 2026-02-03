const { Server } = require('socket.io');
const Message = require('../models/Message');

const socketHandler = (server) => {
  // Define allowed origins exactly as in your main server.js
  const allowedOrigins = [
    'https://www.clubflux.in',
    'https://clubflux.in',
    'http://www.clubflux.in',
    'http://clubflux.in',
    'https://clubflux.netlify.app',
    'https://clubflux.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  const io = new Server(server, {
    cors: {
      // Dynamically check origin to allow credentials
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log("Socket CORS Blocked:", origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"],
      credentials: true // Crucial for session cookies/auth headers
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- ROOM LOGIC ---

    // Standard Chat Rooms (e.g., 'general', 'projects')
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User joined chat room: ${room}`);
    });

    // Individual User Room for Private Admin Notices
    // Frontend should call: socket.emit('join_self', userId)
    socket.on('join_self', (userId) => {
      socket.join(userId);
      console.log(`User joined personal notification room: ${userId}`);
    });

    // --- CHAT LOGIC ---

    socket.on('send_message', async (data) => {
      try {
        if (data.senderId && data.senderId !== "STATIC_ADMIN_ID") {
          await Message.create({
            sender: data.senderId,
            content: data.content,
            chatRoom: data.room || 'general'
          });
        }

        io.to(data.room || 'general').emit('receive_message', {
          sender: {
            _id: data.senderId,
            name: data.senderName || "Anonymous"
          },
          content: data.content,
          chatRoom: data.room || 'general',
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Socket Error:", error.message);
        socket.emit('error_message', { message: "Message delivery failed" });
      }
    });

    // --- E-COMMERCE / ADMIN NOTICES ---

    // Admin sends a notification (Order Placed, Confirmed, etc.)
    socket.on('admin_notice', (data) => {
      // data: { userId, title, message }
      console.log(`Admin Notice for ${data.userId}: ${data.message}`);
      
      // Sends only to the room named after the specific User ID
      io.to(data.userId).emit('notification', {
        title: data.title || "Order Update",
        message: data.message,
        time: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  return io; // Helpful if you need to access 'io' in other files later
};

module.exports = { socketHandler };