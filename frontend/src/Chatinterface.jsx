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
  const [messageStatus, setMessageStatus] = useState({});
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

    const messageHandler = (msg) => {
      setChat((prev) => [...prev, msg]);
      markMessagesAsRead(chatId);
    };

    const messageSentHandler = ({ messageId }) => {
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: 'sent'
      }));
    };

    const messageReadHandler = ({ chatId: readChatId }) => {
      if (readChatId === chatId) {
        setChat(prev => prev.map(msg => msg.senderId === user._id ? { ...msg, read: true } : msg));
      }
    };

    const userStatusHandler = ({ userId, lastSeen: userLastSeen }) => {
      if (userId === receiverId) {
        setLastSeen(userLastSeen);
      }
    };

    socket.on('receiveMessage', messageHandler);
    socket.on('messageSent', messageSentHandler);
    socket.on('messageRead', messageReadHandler);
    socket.on('userStatusChanged', userStatusHandler);

    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('messageSent', messageSentHandler);
      socket.off('messageRead', messageReadHandler);
      socket.off('userStatusChanged', userStatusHandler);
    };
  }, [socket, receiverId, chatId, markMessagesAsRead, user._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (receiverId) {
      sendTypingIndicator(receiverId, true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(receiverId, false);
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (message.trim() && user && receiverId && socket) {
      const tempMessage = {
        senderId: user._id,
        message: message.trim(),
        timestamp: new Date(),
        read: false,
        status: 'sending'
      };
      setChat(prev => [...prev, tempMessage]);
      socket.emit('sendMessage', { senderId: user._id, receiverId, message: message.trim(), listingId, chatId });
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (lastSeenTime) => {
    if (!lastSeenTime) return 'Last seen unknown';
    const now = new Date();
    const last = new Date(lastSeenTime);
    const diff = now - last;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Active now';
    if (mins < 60) return `Active ${mins}m ago`;
    if (hours < 24) return `Active ${hours}h ago`;
    if (days === 1) return 'Active yesterday';
    if (days < 7) return `Active ${days}d ago`;
    return `Last seen ${last.toLocaleDateString()}`;
  };

  const getStatusColor = () => {
    if (receiverOnline) return 'bg-green-500';
    if (!lastSeen) return 'bg-gray-400';
    const diffHours = (new Date() - new Date(lastSeen)) / (1000 * 60 * 60);
    if (diffHours < 1) return 'bg-yellow-500';
    if (diffHours < 24) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (receiverOnline) return 'Online now';
    if (receiverTyping) return 'Typing...';
    return formatLastSeen(lastSeen);
  };

  const getMessageStatusIcon = (msg) => {
    if (msg.senderId !== user._id) return null;
    if (msg.read) {
      return (
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <svg className="w-4 h-4 text-blue-400 -ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    if (msg.status === 'sent' || msg.timestamp) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {receiverInfo?.fullname?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${getStatusColor()} ${receiverOnline ? 'animate-pulse' : ''}`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {receiverInfo?.fullname || 'User'}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()} ${receiverOnline ? 'animate-pulse' : ''}`}></span>
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {chat.map((m, index) => {
          const isOwn = m.senderId === user._id;
          const showTime = index === 0 || (new Date(m.timestamp) - new Date(chat[index - 1].timestamp)) > 300000;
          return (
            <div key={index} className="space-y-1">
              {showTime && (
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {formatTime(m.timestamp)}
                  </span>
                </div>
              )}
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm relative group ${
                  isOwn ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed break-words">{m.message}</p>
                  <div className={`flex items-center justify-between mt-2 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {formatTime(m.timestamp)}
                    </span>
                    {isOwn && <div className="ml-2">{getMessageStatusIcon(m)}</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {receiverTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">{receiverInfo?.fullname || 'User'} is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[3rem] bg-white/80 backdrop-blur-sm"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '3rem',
                maxHeight: '8rem'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-full transition-all duration-200 ${
                message.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
