import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable.jsx';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/Hooks/useGetAllCompanies.jsx';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice.js';
import { Search, PlusCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
    
    return () => {
      dispatch(setSearchCompanyByText(''));
    };
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Company Directory</h1>
              <p className="text-slate-500 mt-1">Manage all registered companies</p>
            </div>
          </div>
        </div>

        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 w-full border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search companies by name, location..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate('/admin/companies/create')}
            className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Company
          </Button>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;