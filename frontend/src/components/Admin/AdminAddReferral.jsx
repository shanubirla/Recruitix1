import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { UploadCloud, Loader2, User, Mail, Building2, Briefcase, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { REF_API_END_POINT } from '@/constants';
import { toast } from 'sonner';

const AdminAddReferral = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    position: '',
    fee: '',
    email: '',
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profilePhoto' && value) {
        data.append('file', value);
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post(`${REF_API_END_POINT}/addRef`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setFormData({
        name: '',
        companyName: '',
        position: '',
        fee: '',
        email: '',
        profilePhoto: null,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-slate-800">Add New Referral</h2>

        {/* Input Fields */}
        {[
          { label: 'Name', name: 'name', icon: <User /> },
          { label: 'Company Name', name: 'companyName' , icon:<Building2/>},
          { label: 'Position', name: 'position', icon:<Briefcase/> },
          { label: 'Fee (INR)', name: 'fee', type: 'number' , icon:<IndianRupee/> },
          { label: 'Email', name: 'email', icon: <Mail /> },
        ].map(({ label, name, type = 'text', icon }) => (
          <div key={name}>
            <Label htmlFor={name} className="text-sm font-medium text-slate-700 mb-1 block">
              {label}
            </Label>
            <div className="relative">
              <Input
                id={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 transition"
              />
              {icon && (
                <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                  {icon}
                </div>
              )}
            </div>
          </div>
        ))}

       
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-1 block">Profile Photo</Label>
          <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-100 transition-all text-center p-2">
            <UploadCloud className="w-5 h-5 text-slate-400" />
            <p className="text-xs text-slate-500">
              <span className="text-teal-600 font-medium">Upload</span> (JPG/PNG, max 2MB)
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

        
          {formData.profilePhoto && (
            <div className="flex items-center mt-2 space-x-2">
              <img
                src={URL.createObjectURL(formData.profilePhoto)}
                alt="preview"
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <p className="text-xs text-slate-600 truncate max-w-[200px]">
                {formData.profilePhoto.name}
              </p>
            </div>
          )}
        </div>


        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white bg-gradient-to-r from-teal-600 to-indigo-600 hover:opacity-90 rounded-lg shadow transition duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding...
            </div>
          ) : (
            'Add Referral'
          )}
        </Button>
      </form>
    </div>
  );
};

export default AdminAddReferral;
