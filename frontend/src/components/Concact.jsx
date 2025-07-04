import React from 'react';
import Navbar from './shared/Navbar.jsx';
import Footer from './Footer.jsx';
import ContactForm from './ContactForm.jsx';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 text-gray-800">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                    Contact <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">Us</span>
                </h1>
                <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-10">
                    Have questions or need assistance? Our team at <strong className="text-teal-700">Recruitix</strong> is here to help. Reach out through the following options, and we'll respond promptly.
                </p>
                <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-14">
                    {/* Contact Information */}
                    <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200 w-full lg:w-auto">
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-6">Contact Information</h2>
                        <p className="text-gray-700 mb-4">
                            <strong>Email:</strong>{' '}
                            <a href="mailto:support@recruitix.com" className="text-teal-600 hover:text-indigo-600 hover:underline transition-colors">
                                support@recruitix.com
                            </a>
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong>Phone:</strong>{' '}
                            <a href="tel:+1234567890" className="text-teal-600 hover:text-indigo-600 hover:underline transition-colors">
                                +1 (234) 567-890
                            </a>
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong>Address:</strong> 123 Recruitix Avenue, Suite 100, San Francisco, CA, 94107
                        </p>
                    </div>
                    
                    {/* Contact Form (Assuming ContactForm is already created) */}
                    <ContactForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
