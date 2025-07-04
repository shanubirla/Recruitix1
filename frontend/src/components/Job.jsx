import React, { useMemo } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();


  const daysAgo = useMemo(() => {
    if (!job?.createdAt) return null;
    const createdAt = new Date(job?.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); 
  }, [job?.createdAt]);

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 w-full'>
   
      <div className='flex items-center justify-between mb-2'>
        <p className='text-sm text-gray-500'>
          {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
        </p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

     
      <div className='flex items-center gap-3 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo || '/default-logo.png'} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name || 'Company Name'}</h1>
          <p className='text-sm text-gray-500'>{job?.company?.location || 'India'}</p>
        </div>
      </div>

      
      <div className='mt-2'>
        <h1 className='font-bold text-lg mb-1'>{job?.title || 'Job Title'}</h1>
        <p className='text-sm text-gray-600 line-clamp-3'>{job?.description || 'Job description goes here'}</p>
      </div>

      
      <div className='flex flex-wrap items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant="ghost">
          {job?.position || 'Position'} Positions
        </Badge>
        <Badge className='text-[#F83002] font-bold' variant="ghost">
          {job?.jobType || 'Job Type'}
        </Badge>
        <Badge className='text-[#7209b7] font-bold' variant="ghost">
          {job?.salary || 'Salary'} LPA
        </Badge>
      </div>

      
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5 w-full'>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Details
        </Button>
        <Button
          className="bg-gradient-to-r from-teal-600 to-indigo-600  hover:bg-[#5e0aa1] text-white w-full sm:w-auto"
        >
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
