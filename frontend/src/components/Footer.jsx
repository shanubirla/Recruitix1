import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8 md:py-12 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          
          
          <div className="mb-6 sm:mb-0">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900">About Us</h2>
            <p className="text-sm text-gray-700">
              At Recruitix, we connect talented individuals with exceptional opportunities, helping you create the career of your dreams.
            </p>
          </div>
          
          
          <div className="mb-6 sm:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-[#6A38C2] transition-colors">
                  Home
                </Link>
              </li> 
              <li>
                <Link to="/about" className="text-gray-700 hover:text-[#6A38C2] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-700 hover:text-[#6A38C2] transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-[#6A38C2] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

         
          <div className="mb-6 sm:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Follow Us</h3>
            <div className="flex space-x-5">
              <a href="https://facebook.com" className="text-gray-600 hover:text-[#6A38C2] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
                </svg>
              </a>
              <a href="https://twitter.com" className="text-gray-600 hover:text-[#6A38C2] transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-600 hover:text-[#6A38C2] transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>

         
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@jobgenie.com" 
                  className="text-gray-700 hover:text-[#6A38C2] transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@recruitix.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-700 hover:text-[#6A38C2] transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
       
        <div className="mt-8 md:mt-12 pt-6 border-t border-gray-100 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} recruitix. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-[#6A38C2]">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#6A38C2]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;