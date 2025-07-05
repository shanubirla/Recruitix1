import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from './context/SocketContext.jsx';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MSG_API_END_POINT, USER_API_END_POINT } from './constants.js';

const ChatInterface = ({ chatId, receiverId, listingId }) => {
  const { socket, isUserOnline, isUserTyping, markMessagesAsRead, sendTypingIndicator } = useSocket();
  const { user } = useSelector(store => store.auth);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const endRef = useRef();
  const inputRef = useRef();
  const typingTimeoutRef = useRef();

  const receiverOnline = isUserOnline(receiverId);
  const receiverTyping = isUserTyping(receiverId);

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      if (!receiverId) return;
      try {
        const res = await axios.get(`${USER_API_END_POINT}/${receiverId}`, { withCredentials: true });
        setReceiverInfo(res.data.user);
        setLastSeen(res.data.user.lastSeen);
      } catch (err) {
        console.error("Failed to load receiver info", err);
      }
    };
    fetchReceiverInfo();
  }, [receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await axios.get(`${MSG_API_END_POINT}/${chatId}`, { withCredentials: true });
        setChat(res.data.messages);
        markMessagesAsRead(chatId);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [chatId, markMessagesAsRead]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      setChat((prev) => [...prev, msg]);
      markMessagesAsRead(chatId);
    };

    const handleMessageRead = ({ chatId: readChatId }) => {
      if (readChatId === chatId) {
        setChat((prev) =>
          prev.map((msg) =>
            msg.senderId === user._id ? { ...msg, read: true } : msg
          )
        );
      }
    };

    const handleUserStatus = ({ userId, lastSeen }) => {
      if (userId === receiverId) setLastSeen(lastSeen);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageRead', handleMessageRead);
    socket.on('userStatusChanged', handleUserStatus);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageRead', handleMessageRead);
      socket.off('userStatusChanged', handleUserStatus);
    };
  }, [socket, chatId, receiverId, markMessagesAsRead, user._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (receiverId) {
      sendTypingIndicator(receiverId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(receiverId, false);
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId,
        message: message.trim(),
        listingId,
        chatId,
      });
      setChat((prev) => [
        ...prev,
        {
          senderId: user._id,
          message: message.trim(),
          timestamp: new Date(),
          read: false,
        },
      ]);
      setMessage('');
      sendTypingIndicator(receiverId, false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getStatusText = () => {
    if (receiverOnline) return 'Online';
    if (receiverTyping) return 'Typing...';
    return lastSeen ? `Last active: ${new Date(lastSeen).toLocaleString()}` : 'Unknown';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">
          {receiverInfo?.fullname?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold">{receiverInfo?.fullname || 'User'}</h2>
          <p className="text-xs text-gray-500">{getStatusText()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-150px)]">
        {chat.map((msg, idx) => {
          const isOwn = msg.senderId === user._id;
          return (
            <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 text-sm ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.message}</p>
                <span className="block text-xs text-right mt-1 opacity-70">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
        {receiverTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-600 rounded-lg px-3 py-2 text-sm">
              Typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ maxHeight: '100px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full transition ${
              message.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
