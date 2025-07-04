import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routs/user.routs.js";
import companyRoute from "./routs/companyrout.js";
import jobRoute from "./routs/jobRout.js";
import applicationRoute from "./routs/applicationRoute.js";
import adminRoute from "./routs/adminRout.js";
import refRoute from './routs/referral.js'
import contactRoutes from "./routs/contact.js";
import feedBackRoute from './routs/feedback.js';
import http from 'http';

dotenv.config({});


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Add ALL frontend domains you use
const allowedOrigins = [
  "http://localhost:5173",
  "https://recruitix1.vercel.app/",
  "https://recruitix1-shanu-birlas-projects.vercel.app/",
  "https://recruitix1-git-main-shanu-birlas-projects.vercel.app/"
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};






const PORT = process.env.PORT || 8000;

app.use(cors(corsOptions)); 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/admin", adminRoute);
app.use('/api/v1/ref', refRoute);
app.use("/api/v1/contact", contactRoutes);
app.use('/api/v1/feedback', feedBackRoute);







import { Chat } from "./Models/chat.js";
import { User } from "./Models/usermodel.js";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.options('*', cors(corsOptions));


const onlineUsers = new Map();
const userSockets = new Map();

const updateLastSeen = async (userId, isOnline = false) => {
  try {
    const updateData = {
      lastSeen: new Date(),
      isOnline
    };

    await User.findByIdAndUpdate(userId, updateData);


    if (onlineUsers.has(userId)) {
      const userData = onlineUsers.get(userId);
      userData.lastSeen = new Date();
      userData.lastActivity = new Date();
    }

    console.log(`Updated last seen for user ${userId}: ${updateData.lastSeen}`);
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
};


const setUserOnline = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Error setting user online:', error);
  }
};


const broadcastUserStatus = (userId, isOnline, lastSeen) => {
  io.emit('userStatusChanged', {
    userId,
    isOnline,
    lastSeen: updateLastSeen || new Date()
  });
};


const broadcastOnlineUsers = () => {
  const onlineUserIds = Array.from(onlineUsers.keys());
  io.emit('getOnlineUsers', onlineUserIds);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  socket.on('registerUser', async (userId) => {
    if (userId) {

      const existingEntry = onlineUsers.get(userId);
      if (existingEntry && existingEntry.socketId !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existingEntry.socketId);
        if (oldSocket) {
          oldSocket.disconnect();
        }
      }

      const now = new Date();
      onlineUsers.set(userId, {
        socketId: socket.id,
        lastSeen: now,
        lastActivity: now,
        connectedAt: now
      });
      userSockets.set(socket.id, userId);

      await setUserOnline(userId);

      socket.join(userId);


      broadcastOnlineUsers();
      broadcastUserStatus(userId, true, now);

      console.log(`User ${userId} registered with socket ${socket.id}`);
    }
  });


  socket.on('sendMessage', async ({ senderId, receiverId, message, listingId, chatId }) => {
    try {

      await updateLastSeen(senderId, true);

      let chat;
      if (chatId) {
        chat = await Chat.findById(chatId);
      } else {
        chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] },
          listingId,
        });
        if (!chat) {
          chat = new Chat({
            participants: [senderId, receiverId],
            listingId,
            messages: [],
          });
        }
      }

      const newMessage = {
        senderId,
        message,
        timestamp: new Date(),
        read: false,
      };

      chat.messages.push(newMessage);
      chat.lastMessage = message;
      chat.lastMessageTime = new Date();
      await chat.save();

      const receiverData = onlineUsers.get(receiverId);
      if (receiverData) {
        io.to(receiverData.socketId).emit('receiveMessage', {
          chatId: chat._id,
          senderId,
          message,
          timestamp: newMessage.timestamp,
          messageId: newMessage._id
        });
      }

      socket.emit('messageSent', {
        chatId: chat._id,
        messageId: newMessage._id,
        timestamp: newMessage.timestamp
      });

      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('typing', async ({ senderId, receiverId, isTyping }) => {

    if (isTyping) {
      await updateLastSeen(senderId, true);
    }

    const receiverData = onlineUsers.get(receiverId);
    if (receiverData) {
      io.to(receiverData.socketId).emit('userTyping', {
        senderId,
        isTyping
      });
    }
  });

  socket.on('markAsRead', async ({ chatId, userId }) => {
    try {

      await updateLastSeen(userId, true);

      const chat = await Chat.findById(chatId);
      if (chat) {
        let updated = false;
        chat.messages.forEach((msg) => {
          if (msg.senderId.toString() !== userId && !msg.read) {
            msg.read = true;
            updated = true;
          }
        });

        if (updated) {
          await chat.save();


          const otherParticipant = chat.participants.find((p) => p.toString() !== userId);
          if (otherParticipant) {
            const senderData = onlineUsers.get(otherParticipant.toString());
            if (senderData) {
              io.to(senderData.socketId).emit('messageRead', {
                chatId,
                readBy: userId
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });


  socket.on('userActivity', async ({ userId }) => {
    await updateLastSeen(userId, true);
  });


  socket.on('disconnect', async () => {
    const userId = userSockets.get(socket.id);

    if (userId) {

      await updateLastSeen(userId, false);


      const userData = onlineUsers.get(userId);
      const lastSeen = userData ? userData.lastSeen : new Date();


      onlineUsers.delete(userId);
      userSockets.delete(socket.id);


      broadcastOnlineUsers();
      broadcastUserStatus(userId, false, lastSeen);

      console.log(`User ${userId} disconnected. Last seen: ${lastSeen}`);
    }

    console.log('User disconnected:', socket.id);
  });


  socket.on('updateStatus', async ({ userId, status }) => {
    await updateLastSeen(userId, true);

    if (status === 'away' || status === 'busy') {
      await User.findByIdAndUpdate(userId, { status });
      broadcastUserStatus(userId, onlineUsers.has(userId), new Date());
    }
  });


  socket.on('ping', async ({ userId }) => {
    await updateLastSeen(userId, true);
    socket.emit('pong', { timestamp: new Date() });
  });
});


setInterval(async () => {
  const now = new Date();
  const staleThreshold = 5 * 60 * 1000;
  const heartbeatThreshold = 2 * 60 * 1000;

  for (const [userId, userData] of onlineUsers.entries()) {
    const timeSinceActivity = now - userData.lastActivity;


    if (timeSinceActivity > staleThreshold) {
      console.log(`Removing stale user ${userId}`);
      await updateLastSeen(userId, false);
      onlineUsers.delete(userId);
      broadcastUserStatus(userId, false, userData.lastSeen);
    }

    else if (timeSinceActivity > heartbeatThreshold) {
      await updateLastSeen(userId, true);
    }
  }

  broadcastOnlineUsers();
}, 60000);


app.post('/api/v1/chat', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {

    await updateLastSeen(senderId, onlineUsers.has(senderId));

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [],
        lastMessage: '',
        lastMessageTime: new Date(),
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Error creating chat' });
  }
});


app.get('/api/v1/messages/:chatId', async (req, res) => {
  try {

    const userId = req.user?.id || req.query.userId;

    if (userId) {
      await updateLastSeen(userId, onlineUsers.has(userId));
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json({ messages: chat.messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/api/v1/chat/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {

    await updateLastSeen(userId, onlineUsers.has(userId));

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'fullname email lastSeen isOnline')
      .sort({ updatedAt: -1 });


    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(msg =>
        msg.senderId.toString() !== userId && !msg.read
      ).length;

      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json(chatsWithUnread);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
});


app.get('/api/v1/user/status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('isOnline lastSeen status');
    const isOnline = onlineUsers.has(req.params.userId);
    const onlineUserData = onlineUsers.get(req.params.userId);

    res.json({
      isOnline,
      lastSeen: isOnline ? new Date() : (user?.lastSeen || null),
      status: user?.status || 'available',
      lastActivity: onlineUserData?.lastActivity || user?.lastSeen
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user status' });
  }
});

app.get('/api/v1/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    const isOnline = onlineUsers.has(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        ...user.toObject(),
        isOnline,
        lastSeen: isOnline ? new Date() : user.lastSeen
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});


app.use('/api/v1', (req, res, next) => {

  if (req.user?.id) {
    updateLastSeen(req.user.id, onlineUsers.has(req.user.id));
  }
  next();
});

export { io, onlineUsers, updateLastSeen };




















server.listen(PORT, () => {
  connectDB();
  console.log(`Server and Socket.IO running on port ${PORT}!`);
});

