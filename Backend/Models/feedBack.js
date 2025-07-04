
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  tag: { type: String, enum: ["Student", "Recruiter"] },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

export const FeedBack = mongoose.model('FeedBack', feedbackSchema);
