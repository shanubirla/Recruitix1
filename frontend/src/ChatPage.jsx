
import ChatSidebar from './ChatSidebar.jsx';
import ChatInterface from './Chatinterface.jsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
    
      <aside className="w-[380px] bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-sm">
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 text-lg">Recruitix Chat</h1>
              <p className="text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></span>
                Connect • Collaborate • Succeed
              </p>
            </div>
          </div>
        </div>
        <ChatSidebar 
          onSelectChat={setSelectedChat} 
          selectedChatId={selectedChat?._id}
        />
      </aside>

      <main className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
        {selectedChat ? (
          <ChatInterface
            key={selectedChat._id}
            receiverId={
              selectedChat.participants.find(
                (p) => p._id.toString() !== user._id.toString()
              )?._id
            }
            listingId={selectedChat.listingId}
            chatId={selectedChat._id}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
         
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100/40 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-100/40 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-indigo-100/30 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
            
            <div className="text-center z-10 animate-fade-in-up p-8">
              <div className="relative mb-8 group">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-teal-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center transform group-hover: scale-105 transition-all duration-300">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce border-2 border-white shadow-sm"></div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Recruitix Chat
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                Select a conversation to start connecting with talented individuals
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
                <div className="flex items-center justify-center space-x-8 text-sm">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-gray-600 font-medium">Real-time</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">Secure</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">Fast</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Built for students & recruiters</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;