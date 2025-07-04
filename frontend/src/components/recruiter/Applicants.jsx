import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar.jsx';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/constants.js';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice.js';
import { toast } from 'sonner';
import { Briefcase, Users } from 'lucide-react';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const response = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(response.data.job));
      } catch (error) {
        console.error('Error fetching applicants:', error.message);
        toast.error('Failed to load applicants');
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Job Applicants
              </h1>
              <p className="text-slate-500 mt-1">
                {applicants?.title || 'Loading job details...'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span>
              {applicants?.applications?.length || 0} applicants
            </span>
          </div>
        </div>

        {/* Content */}
        {applicants?.applications?.length ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ApplicantsTable />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-800">
              No applicants yet
            </h3>
            <p className="mt-2 text-slate-500">
              This job posting hasn't received any applications yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;