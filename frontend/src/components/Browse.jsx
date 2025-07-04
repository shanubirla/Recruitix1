import React, { useEffect } from 'react';
import Navbar from './shared/Navbar.jsx';
import Job from './Job.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/JobSlice.jsx';
import useGetAllJobs from '@/Hooks/useGetAllJobs.jsx';
import Footer from './Footer.jsx';
import { Loader2 } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, loading } = useSelector((store) => store.job);
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className='max-w-7xl mx-auto px-4 my-10 flex flex-col items-center justify-center py-16'>
                    <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
                    <h1 className='font-bold text-xl text-gray-700'>Loading jobs...</h1>
                </div>
                <Footer />
            </div>
        );
    }
    
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10'>
                <h1 className='font-bold text-2xl text-gray-800 mb-6 border-b border-teal-100 pb-2'>
                    Search Results <span className="text-teal-600">({allJobs.length})</span>
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' role="list">
                    {allJobs.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className='text-gray-500 text-lg'>No jobs found. Try refining your search criteria.</p>
                        </div>
                    ) : (
                        allJobs.map((job) => <Job key={job._id} job={job} role="listitem" />)
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Browse;
