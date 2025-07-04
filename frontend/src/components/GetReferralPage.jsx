import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReferralCard from './ReferralCard.jsx';
import { REF_API_END_POINT } from '@/constants.js';
import Navbar from '../components/shared/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Search, Loader2 } from 'lucide-react';

const GetReferralPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${REF_API_END_POINT}/getRef`);
        setReferrals(response.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);
  
  const filteredReferrals = referrals.filter(ref => 
    ref.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Get <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">Help</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with professionals for guidance and referrals. Choose the right person for your needs.
          </p>
        </div>
        
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, company, role or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading referrals...</p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No matching referrals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReferrals.map((referral) => (
              <ReferralCard key={referral._id} referral={referral} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default GetReferralPage;
