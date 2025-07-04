import React, { useEffect, useState, useCallback } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/constants.js';
import { setSingleJob } from '@/redux/JobSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { MessageCircle, Briefcase, MapPin, CalendarDays, Users } from 'lucide-react';
import { CHAT_API_END_POINT } from '@/constants.js';

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const jobId = params.id;
  const formattedDate = singleJob?.createdAt?.split("T")[0] || '';

  const startChatWithRecruiter = async (recruiterId) => {
    try {
      await axios.post(`${CHAT_API_END_POINT}`, {
        senderId: user._id,
        receiverId: recruiterId
      });
      navigate('/messages');
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const applyJobHandler = useCallback(async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, [jobId, user?._id, singleJob, dispatch]);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{singleJob?.title || 'Job Title'}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="text-blue-700 bg-blue-100">{singleJob?.position} Position(s)</Badge>
            <Badge className="text-red-700 bg-red-100">{singleJob?.jobType}</Badge>
            <Badge className="text-purple-700 bg-purple-100">{singleJob?.salary} LPA</Badge>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            onClick={() => startChatWithRecruiter(singleJob.created_by)}
            className="bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Recruiter
          </Button>
          <Button
            onClick={!isApplied ? applyJobHandler : undefined}
            disabled={isApplied}
            className={`${
              isApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            } text-white`}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Job Overview</h2>
          <ul className="space-y-3 text-gray-800">
            <li><Briefcase className="inline mr-2 text-indigo-500" /> <strong>Role:</strong> {singleJob?.title}</li>
            <li><MapPin className="inline mr-2 text-pink-500" /> <strong>Location:</strong> {singleJob?.location}</li>
            <li><CalendarDays className="inline mr-2 text-teal-500" /> <strong>Posted On:</strong> {formattedDate}</li>
            <li><Users className="inline mr-2 text-blue-500" /> <strong>Total Applicants:</strong> {singleJob?.applications?.length || 0}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Requirements</h2>
          <ul className="space-y-3 text-gray-800">
            <li><strong>Experience:</strong> {singleJob?.experience} yrs</li>
            <li><strong>Salary:</strong> ₹{singleJob?.salary} LPA</li>
            <li>
              <strong>Description:</strong>
              <p className="mt-1 text-gray-700">{singleJob?.description}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
