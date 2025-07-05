import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, MessageCircle, RefreshCw, Tag } from "lucide-react";
import { FEED_API_END_POINT } from "@/constants.js";

const RecentFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${FEED_API_END_POINT}/get`);
      setFeedbacks(response.data);
    } catch (err) {
      setError("Failed to load feedbacks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const getTagColor = (tag) => {
    
    const colors = {
      student: "bg-blue-100 text-blue-700 border border-blue-200",
      recruiter: "bg-green-100 text-green-700 border border-green-200",
    };
    return colors[tag.toLowerCase()] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const nextSlide = () => {
    if (feedbacks.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }
  };

  const prevSlide = () => {
    if (feedbacks.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    }
  };

  const getVisibleFeedbacks = () => {
    if (feedbacks.length === 0) return [];
    const itemsToShow = Math.min(3, feedbacks.length);
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % feedbacks.length;
      visible.push(feedbacks[index]);
    }
    return visible;
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="inline-flex items-center space-x-2">
          <span className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></span>
          <span className="text-blue-600 font-medium">Loading feedbacks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <MessageCircle className="w-10 h-10 text-red-500 mx-auto" />
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={fetchFeedbacks}
          className="mt-4 flex items-center px-4 py-2 border border-red-400 text-red-700 rounded hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  const visibleFeedbacks = getVisibleFeedbacks();

  return (
    <div className="p-2">
      <div className="text-center mb-8">
        <MessageCircle className="w-10 h-10 text-purple-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">What People Are Saying</h2>
        <p className="text-gray-600 mt-1">Real feedback from our amazing users</p>
        <div className="mt-2 text-blue-600 font-medium">{feedbacks.length} Review{feedbacks.length !== 1 && "s"}</div>
      </div>

      {feedbacks.length > 0 ? (
        <div className="relative max-w-6xl mx-auto">
          <div className="flex overflow-hidden">
            {visibleFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
              > 
                <div className="bg-white shadow-md rounded-lg p-2 h-full flex flex-col justify-between">
                  <div className="ml-60">  {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}</div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">{renderStars(feedback.rating)}</div>
                      
                      <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(feedback.tag)}`}>
                        <Tag className="w-3 h-3 inline mr-1" />
                        {feedback.tag}
                      </span>
                    </div>
                    <blockquote className="italic text-gray-700">
                      "{feedback.feedback}"
                    </blockquote>
                  </div>

                 <div className="flex items-center mt-4 border-t pt-3">
  <img
    src={
      feedback.userId?.profile?.profilePhoto ||
      "https://via.placeholder.com/40"
    }
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover mr-3"
  />
  <div>
    <p className="text-sm font-semibold text-gray-800">
      {feedback.userId?.fullname || feedback.name}
    </p>
    <p className="text-xs text-gray-500">
      Verified User 
    </p>
  </div>
</div>

                </div>
              </div>
            ))}
          </div>

          {feedbacks.length > 3 && (
            <div className="flex justify-between mt-4 px-4">
              <button
                onClick={prevSlide}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              >
                ◀
              </button>
              <button
                onClick={nextSlide}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-8 text-gray-500">No feedbacks yet.</div>
      )}
      <div className="  text-center">
              <p className="text-gray-600 mb-4">
                Want to share your experience?
              </p>
              <button 
                className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() =>window.location.href = 'https://recruitix.onrender.com/api/v1/feedback/get'}
              >
                Leave a Review
              </button>
            </div>
          
    </div>
  );
};

export default RecentFeedbacks;
