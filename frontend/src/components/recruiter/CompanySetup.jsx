import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Globe, MapPin, Building2, Image } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/constants.js';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/Hooks/useGetCompanyById.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    if (input.file) formData.append('file', input.file);

    try {
      setLoading(true);
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('Company details updated successfully');
        navigate('/admin/companies');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update company details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || '',
        description: singleCompany.description || '',
        website: singleCompany.website || '',
        location: singleCompany.location || '',
        file: null,
      });
      if (singleCompany.logo) {
        setPreview(singleCompany.logo);
      }
    }
  }, [singleCompany]);

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
                onClick={() => navigate('/admin/companies')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Company Setup</h1>
                <p className="text-slate-500 mt-1">Complete your company profile</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-slate-700 mb-2">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter company name"
                      value={input.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="text-slate-700 mb-2">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      className="pl-10 border-slate-300 focus:ring-2 focus:ring-teal-500"
                      placeholder="https://example.com"
                      value={input.website}
                      onChange={handleInputChange}
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
                      placeholder="City, Country"
                      value={input.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description" className="text-slate-700 mb-2">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    className="border-slate-300 focus:ring-2 focus:ring-teal-500"
                    placeholder="Brief description about your company"
                    value={input.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="logo" className="text-slate-700 mb-2">
                    Company Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {preview && (
                      <div className="h-16 w-16 rounded-full border border-slate-200 overflow-hidden">
                        <LazyLoadImage
                          src={preview} 
                          alt="Company logo preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="relative">
                        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                            <Image className="w-8 h-8 text-slate-400" />
                            <p className="text-sm text-slate-500 mt-2">
                              <span className="font-semibold text-teal-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                          </div>
                          <Input 
                            id="logo" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate('/admin/companies')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;