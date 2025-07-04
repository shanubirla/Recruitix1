import React, { useEffect, useState } from 'react';
import LatestJobCards from './LatestJobCards.jsx';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Simulate loading state, if needed
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
    return (
        <div className='max-w-7xl mx-auto my-10  '>
            <h1 className='text-4xl font-bold'>
                <span className='bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent'>Latest & Top </span> Job Openings
            </h1>

            {loading ? (
                <div className="text-center mt-10">Loading...</div>
            ) : error ? (
                <div className="text-center mt-10 text-red-500">Something went wrong. Please try again later.</div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                    {
                        allJobs?.length <= 0 ? (
                            <div className="col-span-full text-center mt-10 text-gray-500">No Job Available</div>
                        ) : (
                            allJobs.slice(0, 6).map((job) => (
                                <LatestJobCards key={job._id} job={job} />
                            ))
                        )
                    }
                </div>
            )}
        </div>
    );
}

export default LatestJobs;
