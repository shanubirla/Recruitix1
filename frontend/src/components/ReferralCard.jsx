import React, { useState } from 'react';

import ReferralForm from './ReferralForm.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';




const ReferralCard = ({ referral }) => {
  const [showForm, setShowForm] = useState(false);

  const handleGetReferral = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };
   return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-md bg-white flex flex-col items-center transition-all hover:shadow-lg w-full max-w-sm">
  
  <LazyLoadImage
    src={referral.profilePhoto}
    alt={referral.name}
    className="rounded-full w-24 h-24 border-4 border-gradient-to-r from-teal-600 to-indigo-600 mb-4"
  />


  <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">{referral.name}</h2>
  <p className="text-gray-700 mt-1 text-lg">💼 {referral.position}</p>
  <p className="text-gray-600">🏢 {referral.companyName}</p>

  <p className="text-[#6A38C2] font-medium text-lg mt-3">Fee: ₹{referral.fee}</p>


  <button
    className="mt-4 w-full bg-gradient-to-r from-teal-600 to-indigo-600  text-white py-2 rounded-full font-medium 
               transition-all hover:bg-[#572fa3] focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/50"
    onClick={handleGetReferral}
  >
    Get Help
  </button>


  {showForm && (
    <div className="w-full mt-4 border-t border-gray-300 pt-4">
      <ReferralForm referralId={referral._id} amount={referral.fee} onClose={handleCloseForm} />
    </div>
  )}
</div>


  
      
  );
};

export default ReferralCard;
