import ChatSidebar from './ChatSidebar.jsx';
import ChatInterface from './Chatinterface.jsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 relative">
      
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-md"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-[380px] w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-sm`}>
        <div className="p-6 border-b border-gray-200/50 shadow-sm">
          <h1 className="font-semibold text-gray-800 text-lg">Recruitix Chat</h1>
          <p className="text-sm text-gray-500">Connect • Collaborate • Succeed</p>
        </div>
        <ChatSidebar 
          onSelectChat={(chat) => { 
            setSelectedChat(chat);
            setSidebarOpen(false); // Close sidebar on mobile after selecting
          }} 
          selectedChatId={selectedChat?._id}
        />
      </aside>

      {/* Chat Interface */}
      <main className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatInterface
            key={selectedChat._id}
            receiverId={selectedChat.participants.find((p) => p._id !== user._id)?._id}
            listingId={selectedChat.listingId}
            chatId={selectedChat._id}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Recruitix Chat</h2>
            <p className="text-gray-600 mb-8">Select a conversation to start connecting with others.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
