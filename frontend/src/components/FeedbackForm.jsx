import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star, Send, MessageSquare, User, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { FEED_API_END_POINT } from "@/constants.js";

const FeedbackForm = () => {
  const {user}=useSelector((store)=>store.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rating: 0,
    feedback: "",
    tag: user?.role === "student" ? "Student" : "Recruiter",
  });
  const [hovered, setHovered] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit feedback.");
      navigate("/login");
      return;
    }
    if (form.rating === 0) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${FEED_API_END_POINT}/post`, {
        ...form,
        userId: user._id,
        name: user.name,
      });
      setShowSuccess(true);
      setForm({ ...form, feedback: "", rating: 0 });
      setHovered(0);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setIsSubmitting(false);
      navigate("/");
    }
  };

  const getRatingText = (rating) => {
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[rating] || "";
  };

  return (
    <div className="max-w-md mx-auto  bg-white shadow-lg rounded-lg">
      {!user ? (
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">Please log in to submit feedback</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <User className="inline-block w-4 h-4 mr-1" />
            Log In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {showSuccess && (
            <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm">
              <MessageSquare className="inline-block w-4 h-4 mr-2" />
              Feedback submitted successfully!
            </div>
          )}

          <div className="text-center mb-4">
            <MessageSquare className="w-10 h-10 mx-auto text-blue-600 mb-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Share Your Experience
            </h2>
            <p className="text-gray-500">Your feedback helps us grow</p>
          </div>

          <div className="flex justify-center space-x-2 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setForm({ ...form, rating: star })}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hovered || form.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>

          {(hovered || form.rating) > 0 && (
            <p className="text-center text-sm text-gray-600 mb-2">
              {getRatingText(hovered || form.rating)} ({hovered || form.rating} star{(hovered || form.rating) > 1 ? "s" : ""})
            </p>
          )}

          <textarea
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            placeholder="Tell us what you think..."
            className="w-full h-28 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {form.feedback.length}/500 characters
          </p>

          <button
            type="submit"
            disabled={form.rating === 0 || !form.feedback.trim() || isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-2 rounded hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </span>
            ) : (
              <>
                <Send className="inline w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
