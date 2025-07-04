import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { useCallback } from 'react';
import { BACKEND_END_POINT } from '@/constants.js';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const { user } = useSelector(store => store.auth);
















const sendHeartbeat = useCallback(() => {
  if (socket && user?._id) {
    socket.emit('ping', { userId: user._id });
  }
}, [socket, user]);


useEffect(() => {
  if (socket && user) {
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 60000); 

    return () => clearInterval(interval);
  }
}, [socket, user, sendHeartbeat]);


const updateActivity = useCallback(() => {
  if (socket && user?._id) {
    socket.emit('userActivity', { userId: user._id });
  }
}, [socket, user]);










  useEffect(() => {
    if (user) {
      const newSocket = io(`${BACKEND_END_POINT}`, {
        query: {
          userId: user._id,
        },
        transports: ['websocket'],
      });

    
      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('registerUser', user._id);
      });

     
      newSocket.on('getOnlineUsers', (users) => {
        console.log('Online users:', users);
        setOnlineUsers(new Set(users));
      });

      newSocket.on('userStatusChanged', ({ userId, isOnline, lastSeen }) => {
        console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (isOnline) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

     
      newSocket.on('userTyping', ({ senderId, isTyping }) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          if (isTyping) {
            newMap.set(senderId, true);
          } else {
            newMap.delete(senderId);
          }
          return newMap;
        });
      });

     
      newSocket.on('messageRead', ({ chatId, readBy }) => {
        console.log(`Messages in chat ${chatId} read by ${readBy}`);
       
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

 
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const isUserTyping = (userId) => {
    return typingUsers.has(userId);
  };

  const markMessagesAsRead = (chatId) => {
    if (socket && user) {
      socket.emit('markAsRead', {
        chatId,
        userId: user._id
      });
    }
  };

  const sendTypingIndicator = (receiverId, isTyping) => {
    if (socket && user) {
      socket.emit('typing', {
        senderId: user._id,
        receiverId,
        isTyping
      });
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      onlineUsers, 
      typingUsers,
      isUserOnline, 
      isUserTyping,
      markMessagesAsRead,
      sendTypingIndicator
    }}>
      {children}
    </SocketContext.Provider>
  );
};