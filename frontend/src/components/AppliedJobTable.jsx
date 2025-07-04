import React from 'react';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    
    if (!allAppliedJobs) {
        return <p className="text-gray-500 text-center py-4">Loading jobs...</p>;
    }
    
    return (
        <div className="space-y-4 p-4 md:p-6 lg:p-8 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 border-b pb-3 mb-4 border-teal-100">Your Applied Jobs</h2>
            {allAppliedJobs.length <= 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-inner text-gray-500">
                    You haven't applied for any jobs yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {allAppliedJobs.map((appliedJob) => (
                        <div
                            key={appliedJob._id}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-md p-4 rounded-lg border border-gray-100 hover:border-teal-200 transition-all"
                        >
                            <div className="flex-1 space-y-2  md:space-y-0 md:space-x-6 md:flex items-center justify-between">
                                <span className="text-sm text-gray-500 block md:inline">
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </span>
                                <span className="text-md font-medium text-gray-800 block md:inline">
                                    {appliedJob.job?.title || 'N/A'}
                                </span>
                                <span className="text-md text-teal-600 block md:inline">
                                    {appliedJob.job?.company?.name || 'N/A'}
                                </span>
                                 <Badge
                                className={`mt-3 md:mt-0 text-white px-3 py-1 ${
                                    appliedJob?.status === "rejected"
                                        ? "bg-red-500"
                                        : appliedJob.status === "pending"
                                        ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                        : "bg-gradient-to-r from-teal-500 to-indigo-500"
                                }`}
                            >
                                {appliedJob.status.toUpperCase()}
                            </Badge>
                            </div>
                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedJobTable;
