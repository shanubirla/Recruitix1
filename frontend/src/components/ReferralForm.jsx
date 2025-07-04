import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { REF_API_END_POINT } from "@/constants.js";

const ReferralForm = ({ referralId, amount, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    companyRequested: "",
    resume: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedForPayment = async () => {
    try {
      const { studentName, studentEmail, companyRequested, resume } = formData;

   
      const res = await axios.post(`${REF_API_END_POINT}/create-order`, {
        amount,
        studentName,
        studentEmail,
        companyRequested,
        resume,
        referralId,
      });

      const { order } = res.data;
      if (!order) {
        alert("Order creation failed!");
        return;
      }

  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Referral Request Payment",
        description: `Referral for ${companyRequested}`,
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_signature } = response;

          const verifyRes = await axios.post(`${REF_API_END_POINT}/verify-payment`, {
            razorpay_payment_id,
            orderId: order.id,
            razorpay_signature,
          });

          if (verifyRes.data.success) {
            alert("Payment successful!");
            navigate("/");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: studentName,
          email: studentEmail,
        },
        notes: { referralId },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error initiating payment: ", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Request a Referral</h2>
        <form className="space-y-4">
          <input type="text" name="studentName" placeholder="Full Name" value={formData.studentName} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input type="email" name="studentEmail" placeholder="Email" value={formData.studentEmail} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input type="text" name="companyRequested" placeholder="Company" value={formData.companyRequested} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input type="url" name="resume" placeholder="Resume URL" value={formData.resume} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </form>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleProceedForPayment} className="bg-blue-600 text-white px-4 py-2 rounded">Proceed for Payment</button>
        </div>
      </div>
    </div>
  );
};

export default ReferralForm;
