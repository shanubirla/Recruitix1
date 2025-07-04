import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CHAT_API_END_POINT } from './constants.js';

const ChatSidebar = ({ onSelectChat, selectedChatId }) => {
  const { user } = useSelector((store) => store.auth);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user._id) return;

      try {
        setLoading(true);
        const res = await axios.get(`${CHAT_API_END_POINT}/user/${user._id}`);
        setChats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p._id !== user._id);
    return otherUser?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  if (loading) {
    return (
      <div className="h-full p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
  
  <div className="p-4 border-b border-gray-200">
    <div className="relative">
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>

 
  <div className="flex-1  p-2 space-y-2">
    {filteredChats.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="font-medium">No conversations yet</p>
        <p className="text-sm text-gray-400 mt-1">Start networking with recruiters!</p>
      </div>
    ) : (
      filteredChats.map((chat) => {
        const otherUser = chat.participants.find(p => p._id !== user._id);
        const isSelected = selectedChatId === chat._id;
        const hasUnread = chat.unreadCount > 0;

        return (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white border border-gray-200 hover:shadow-md hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center space-x-3">
          
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    isSelected
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm'
                  }`}
                >
                  {otherUser?.fullname?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>

                {hasUnread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {chat.unreadCount}
                  </div>
                )}
              </div>

        
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <h4
                    className={`font-semibold truncate ${
                      isSelected ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {otherUser?.fullname || 'User'}
                  </h4>
                  <span
                    className={`text-xs ${
                      isSelected ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm truncate ${
                      isSelected
                        ? 'text-blue-100'
                        : hasUnread
                        ? 'text-gray-800 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {truncateMessage(chat.lastMessage)}
                  </p>
                  {hasUnread && !isSelected && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            </div>

            {!isSelected && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            )}
          </div>
        );
      })
    )}
  </div>

  
</div>

  );
};

export default ChatSidebar;