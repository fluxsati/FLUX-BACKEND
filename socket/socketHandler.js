const { Server } = require('socket.io');
const Message = require('../models/Message');

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
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
};

module.exports = { socketHandler };