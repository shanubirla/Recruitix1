import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

  
    const truncateText = (text, length = 150) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow
            '>
            
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name || 'Company Name'}</h1>
                <p className='text-sm text-gray-500'>{job?.location || 'Location not specified'}</p>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title || 'Job Title'}</h1>
                <p className='text-sm text-gray-600'>{truncateText(job?.description, 150)}</p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards;
