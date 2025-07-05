import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CHAT_API_END_POINT } from './constants.js';

const ChatSidebar = ({ onSelectChat, selectedChatId }) => {
  const { user } = useSelector((store) => store.auth);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const res = await axios.get(`${CHAT_API_END_POINT}/user/${user._id}`);
          setChats(res.data || []);
        } catch (err) {
          console.error('Error loading chats:', err);
        }
      }
    };
    fetchChats();
  }, [user]);

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.participants.find((p) => p._id !== user._id);
    return otherUser?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {filteredChats.map((chat) => {
          const otherUser = chat.participants.find((p) => p._id !== user._id);
          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedChatId === chat._id ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
              }`}
            >
              <h4 className="font-semibold truncate">{otherUser?.fullname || 'User'}</h4>
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'No messages yet'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
