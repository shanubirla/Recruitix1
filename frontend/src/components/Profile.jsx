import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar.jsx';
import { Contact, Mail, Pen, Download, Calendar, Briefcase, Star, Upload } from 'lucide-react';
import AppliedJobTable from './AppliedJobTable.jsx';
import UpdateProfileDialog from './UpdateProfileDialog.jsx';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/Hooks/useGetAppliedJobs.jsx';
import Footer from './Footer.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 h-48">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
                {/* Profile Header */}
                <div className="bg-white/95 shadow-xl rounded-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                {user?.profile?.profilePhoto ? (
                                    <LazyLoadImage src={user.profile.profilePhoto} alt="profile" className="object-cover w-full h-full" />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-teal-500 text-white flex items-center justify-center text-3xl font-bold">
                                        {getInitials(user?.fullname)}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(true)}
                                className="absolute -bottom-2 -right-2 h-10 w-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center"
                            >
                                <Upload className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.fullname || 'Your Name'}</h1>
                                    <p className="text-lg text-gray-600 mb-3">{user?.profile?.bio || 'Add your professional bio'}</p>
                                </div>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:to-indigo-700 text-white px-6 py-2 rounded-md flex items-center"
                                >
                                    <Pen className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-purple-600" />
                                    <span>{user?.email || 'Add email'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Contact className="h-5 w-5 text-purple-600" />
                                    <span>{user?.phoneNumber || 'Add phone number'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white/95 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-purple-600" />
                            Skills & Expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills?.length > 0 ? (
                                user.profile.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 w-full">
                                    <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>Add your skills to showcase your expertise</p>
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="mt-3 px-4 py-2 border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50"
                                    >
                                        Add Skills
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume */}
                    <div className="bg-white/95 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Briefcase className="h-5 w-5 text-purple-600" />
                            Resume
                        </h2>
                        {user?.profile?.resume ? (
                            <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 truncate">
                                                {user.profile.resumeOriginalName || 'Resume.pdf'}
                                            </p>
                                            <p className="text-sm text-gray-500">PDF Document</p>
                                        </div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <a
                                    href={user.profile.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <button className="w-full border border-purple-200 text-purple-600 hover:bg-purple-50 py-2 rounded-md flex items-center justify-center">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Resume
                                    </button>
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="mb-3">Upload your resume to get noticed by employers</p>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="border border-purple-200 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-md flex items-center justify-center"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Resume
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Applied Jobs */}
                <div className="bg-white/95 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        Applied Jobs
                    </h2>
                    <hr className="my-4 border-gray-300" />
                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
            <Footer />
        </div>
    );
};

export default Profile;
