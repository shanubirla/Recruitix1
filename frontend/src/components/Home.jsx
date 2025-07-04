import React, { useEffect } from 'react';
import Navbar from './shared/Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import CategoryCarousel from './CategoryCarouser';
import LatestJobs from './LatestJobs.jsx';
import Footer from './Footer.jsx';
import useGetAllJobs from '@/Hooks/useGetAllJobs.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from './FeedbackForm.jsx';
import RecentFeedbacks from './RecentFeedbacks.jsx';

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const handleClick =()=>{
    if(user){
      navigate('/referral');
    }
    else{
      navigate('/login')
    }
  }
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
    if(user?.role==='admin'){
      navigate('/admin/dashboard');
    }

  }, [user, navigate]);

  return (
    <div className=" min-h-screen">
     
      <Navbar />

    
      <HeroSection className="bg-gradient-to-r from-[#6A38C2] via-[#8140D8] to-[#5b30a6] text-white py-16" />

      <div className="max-w-7xl mx-auto ">
        <CategoryCarousel />
      </div>

      <div className="flex flex-col items-center text-center p-10  rounded-2xl ">
  <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-4">
    Stuck in a Problem? <span className="text-black">Need Help?</span>
  </h1>
  <p className="text-gray-600 mb-6 text-lg max-w-lg">
    Don’t worry! Click below to get assistance and resolve your issues quickly.
  </p>
  <button 
    className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-xl 
               transition-transform hover:bg-[#572fa3] hover:scale-105 
               focus:outline-none focus:ring-4 focus:ring-purple-300"
    onClick={handleClick}
  >
    Get Help
  </button>
</div>
      <div className="  py-10">
        <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-6">Latest Job Openings</h2>
        <LatestJobs />
      </div>
     

      
      <RecentFeedbacks/>
      <Footer  />
      
    </div>
  );
};

export default Home;
