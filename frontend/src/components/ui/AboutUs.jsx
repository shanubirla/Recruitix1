import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../Footer';

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
        <Navbar/>
      {/* Hero Section */}
      <div className="bg-white  ">
        <div className="container mx-auto px-4 text-center">
        <div className='flex flex-col gap-5 my-10'>
        <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#e7211e] font-bold'>Trusted by Thousands of Job Seekers</span>
          <h1 className="text-5xl font-bold mb-4">About <span className='bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent'>recruitix</span></h1>
        <p className="text-lg max-w-2xl mx-auto">
            Empowering job seekers and recruiters to find the perfect match with innovative tools and solutions.
          </p>
          </div>
        </div>
      </div>
      <div className="bg-white ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">Why Choose <span className='bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent'>recruitix</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 shadow-md p-6 m-6 ">
              <div className=" p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6A38C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 18l-4-4h3V8h2v6h3l-4 4z"/></svg>
              </div>
              <h3 className="text-xl font-semibold">Effortless Job Search</h3>
              <p className="text-gray-600">
                Advanced search tools to help you find the right job quickly and easily.
              </p>
            </div>
            <div className="space-y-4 shadow-md p-6 m-6">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6A38C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4C8.13 4 4.9 6.95 4.25 10.74a7.97 7.97 0 0010.93 10.93c3.79-.65 6.74-3.88 6.74-7.93 0-4.41-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
              </div>
              <h3 className="text-xl font-semibold">Smart Matching</h3>
              <p className="text-gray-600">
                Our algorithm connects you to jobs and candidates that truly fit your needs.
              </p>
            </div>
            <div className="space-y-4 shadow-md p-6 m-6">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <h3 className="text-xl font-semibold">Comprehensive Support</h3>
              <p className="text-gray-600">
                Dedicated resources and support to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
     
      <div className="container  p-6">
 
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  m-12   ">
    
    <div className="relative p-8 bg-white shadow-lg rounded-lg mr-3">
      <div className="absolute -top-8 -left-8 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
        <svg
          className="w-8 h-8 bg-gradient-to-r from-teal-600 to-indigo-600 "
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0L8.4 3.6l1.5 1.5L10.5 3l1.5 1.5 1.5-1.5L12 0zm9.9 4.5l-3.6 1.5 1.5 1.5L20.4 6l1.5 1.5 1.5-1.5-1.5-1.5zm-19.8 0L1.5 6l1.5 1.5L4.5 6l1.5 1.5 1.5-1.5-1.5-1.5L4.5 3l-1.5 1.5zM12 24l3.6-3.6-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5L12 24zm9.9-4.5l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5 1.5 1.5L20.4 18l1.5 1.5zM4.5 18l1.5-1.5 1.5 1.5-1.5 1.5-1.5-1.5zm7.5-3h4V8h-4v7zm-2 0V8H6v7h4zm8-7v7h4V8h-4z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent ">Our Mission</h2>
      <p className="text-lg text-gray-600 leading-relaxed p-6">
        At <strong>Recruitix</strong>, our mission is to simplify the job search process by connecting talented individuals 
        with meaningful opportunities, while helping businesses build exceptional teams. We aim to transform the hiring 
        landscape with user-friendly tools and personalized support.
      </p>
    </div>

    {/* Vision Section */}
    <div className="relative p-8 bg-white shadow-lg rounded-lg m-3">
      <div className="absolute -top-8 -left-8 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center">
        <svg
          className="w-8 h-8 bg-gradient-to-r from-teal-600 to-indigo-600 "
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0L8.4 3.6l1.5 1.5L10.5 3l1.5 1.5 1.5-1.5L12 0zm9.9 4.5l-3.6 1.5 1.5 1.5L20.4 6l1.5 1.5 1.5-1.5-1.5-1.5zm-19.8 0L1.5 6l1.5 1.5L4.5 6l1.5 1.5 1.5-1.5-1.5-1.5L4.5 3l-1.5 1.5zM12 24l3.6-3.6-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5L12 24zm9.9-4.5l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5 1.5 1.5L20.4 18l1.5 1.5zM4.5 18l1.5-1.5 1.5 1.5-1.5 1.5-1.5-1.5zm7.5-3h4V8h-4v7zm-2 0V8H6v7h4zm8-7v7h4V8h-4z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-4">Our Vision</h2>
      <p className="text-lg text-gray-600 leading-relaxed p-6">
        We envision a world where job seekers and employers can connect seamlessly, fostering professional growth 
        and innovation. Our goal is to empower people to reach their career potential while helping organizations 
        thrive in a competitive world.
      </p>
    </div>
  </div>
</div>


      
      <div className="bg-white mb-6">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your <br/> <span className='bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent'>Next Opportunity?</span></h2>
          <p className="text-lg mb-6">Join thousands of professionals who trust Recruitix to elevate their careers.</p>
          <a href="/signup" className= "bg-gradient-to-r from-teal-600 to-indigo-600  text-black  py-2 px-6 rounded-full hover:bg-gray-100 transition">
            Get Started
          </a>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutUs;
