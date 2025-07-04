import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable.jsx';
import useGetAllAdminJobs from '@/Hooks/useGetAllAdminJobs.jsx';
import { setSearchJobByText } from '@/redux/JobSlice.jsx';
import { Search, PlusCircle } from 'lucide-react';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Job Management</h1>
            <p className="text-slate-500 mt-1">View and manage all job postings</p>
          </div>
          
          <Button 
            onClick={() => navigate('/admin/jobs/create')}
            className="mt-4 md:mt-0 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Job
          </Button>
        </div>


        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 w-full border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search jobs by title, company..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
}

export default AdminJobs;