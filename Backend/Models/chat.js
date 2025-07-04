import mongoose from 'mongoose';
import { User } from './usermodel.js';
const MessageSchema = new mongoose.Schema({
  senderId: String,
  message: String,
  timestamp: Date,
  read: Boolean,
});
const ChatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],
  listingId: String,
  messages: [MessageSchema],
  lastMessage: String,
  lastMessageTime: Date,
});
console.log("chat model is defined");
export const Chat = mongoose.model('Chat', ChatSchema);