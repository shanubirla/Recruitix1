import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Delete, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { JOB_API_END_POINT } from '@/constants.js';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const DeleteJob = async (jobId) => {
    try {
      await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true });
      setFilterJobs((jobs) => jobs.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="hidden sm:block">
        {/* Desktop Table */}
        <Table>
          <TableCaption className="text-slate-500 mt-4">
            {filterJobs.length} job postings found
          </TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-slate-700 font-medium">Company</TableHead>
              <TableHead className="text-slate-700 font-medium">Role</TableHead>
              <TableHead className="text-slate-700 font-medium">Status</TableHead>
              <TableHead className="text-slate-700 font-medium">Posted</TableHead>
              <TableHead className="text-right text-slate-700 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterJobs.length > 0 ? (
              filterJobs.map((job) => (
                <TableRow key={job._id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      {job?.company?.logo && (
                        <LazyLoadImage
                          src={job.company.logo}
                          alt={job.company.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span>{job?.company?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-800">{job?.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {job?.jobType} • {job?.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={job?.status === 'active' ? 'default' : 'secondary'}
                      className={
                        job?.status === 'active'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }
                    >
                      {job?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {formatDate(job?.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-teal-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2 space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-slate-700 hover:bg-slate-100"
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-teal-600" />
                          Applicants
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-rose-600 hover:bg-rose-50"
                          onClick={() => DeleteJob(job._id)}
                        >
                          <Delete className="mr-2 h-4 w-4 text-rose-600" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                  No jobs found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden p-2 space-y-4">
        {filterJobs.length > 0 ? (
          filterJobs.map((job) => (
            <div
              key={job._id}
              className="border border-slate-200 rounded-lg shadow-sm p-4 space-y-2 bg-white"
            >
              <div className="flex items-center gap-3">
                {job?.company?.logo && (
                  <LazyLoadImage
                    src={job.company.logo}
                    alt={job.company.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div className="font-medium text-slate-800">{job?.company?.name}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-800">{job?.title}</div>
                <div className="text-xs text-slate-500">
                  {job?.jobType} • {job?.location}
                </div>
              </div>
              <div>
                <Badge
                  className={
                    job?.status === 'active'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-rose-100 text-rose-800'
                  }
                >
                  {job?.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500">
                Posted: {formatDate(job?.createdAt)}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                >
                  Applicants
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => DeleteJob(job._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-6">
            No jobs found matching your criteria
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminJobsTable;
