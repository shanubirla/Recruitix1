

import { FeedBack } from "../Models/feedBack.js";
export const postFeedBack = async (req, res) => {
  const { userId, name, tag, rating, feedback } = req.body;
  const newFeedback = new FeedBack({ userId, name, tag, rating, feedback });
  await newFeedback.save();
  res.status(201).json({ message: "Feedback submitted" });
};


export const getRecentFeedBack = async (req, res) => {
  try {
    const feedbacks = await FeedBack.find().sort({ createdAt: -1 })
      .populate("userId", "fullname profile.profilePhoto");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }

};