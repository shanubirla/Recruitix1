import React, { useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Briefcase, MapPin, DollarSign, Clock, FileText } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/constants.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const PostJob = () => {
  const navigate = useNavigate();
  const { companies } = useSelector(store => store.company);
  
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company._id === value);
    setInput({ ...input, companyId: selectedCompany?._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!input.companyId) {
      toast.error('Please select a company');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-600 hover:bg-slate-100"
                onClick={() => navigate('/admin/jobs')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Post New Job</h1>
                <p className="text-slate-500 mt-1">Fill in the details for your job posting</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-slate-700 mb-2">
                    Job Title
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Senior Software Engineer"
                      value={input.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-slate-700 mb-2">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Remote, New York"
                      value={input.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="salary" className="text-slate-700 mb-2">
                    Salary
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="salary"
                      name="salary"
                      type="text"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. $90,000 - $120,000"
                      value={input.salary}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobType" className="text-slate-700 mb-2">
                    Job Type
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="jobType"
                      name="jobType"
                      type="text"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Full-time, Contract"
                      value={input.jobType}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {companies.length > 0 ? (
                  <div>
                    <Label htmlFor="company" className="text-slate-700 mb-2">
                      Company
                    </Label>
                    <Select onValueChange={selectChangeHandler}>
                      <SelectTrigger className="border-slate-300 focus:ring-2 focus:ring-teal-500">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700">
                      You need to <span className="font-semibold text-teal-600">register a company</span> before posting a job
                    </p>
                    <Button
                      variant="link"
                      className="text-teal-600 px-0 mt-2"
                      onClick={() => navigate('/admin/company')}
                    >
                      Create Company
                    </Button>
                  </div>
                )}

                <div>
                  <Label htmlFor="experience" className="text-slate-700 mb-2">
                    Experience Level
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    className="border-slate-300 focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 3+ years"
                    value={input.experience}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="text-slate-700 mb-2">
                    Number of Positions
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="1"
                    className="border-slate-300 focus:ring-2 focus:ring-teal-500"
                    value={input.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-slate-700 mb-2">
                    Requirements
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="requirements"
                      name="requirements"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500 min-h-[100px]"
                      placeholder="List the required skills and qualifications"
                      value={input.requirements}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description" className="text-slate-700 mb-2">
                Job Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="border-slate-300 focus:ring-2 focus:ring-teal-500 min-h-[120px]"
                placeholder="Detailed description of the job responsibilities"
                value={input.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate('/admin/jobs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || companies.length === 0}
                className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Job'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;