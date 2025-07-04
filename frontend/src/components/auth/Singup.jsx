import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/constants.js';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice.js';
import {User, Mail, Phone, Lock, Loader2 ,UploadCloud } from 'lucide-react';
import Footer from '../Footer';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        file: ''
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
              <p className="text-slate-500">Join our platform to get started</p>
            </div>
            
            <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="space-y-5">
               
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-1">Full Name</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={input.fullname}
                      name="fullname"
                      onChange={changeEventHandler}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </div>
     
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-1">Email</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={input.email}
                      name="email"
                      onChange={changeEventHandler}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </div>
      
               
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={input.phoneNumber}
                      name="phoneNumber"
                      onChange={changeEventHandler}
                      placeholder="+1 (123) 456-7890"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </div>
      
                
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-1">Password</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={input.password}
                      name="password"
                      onChange={changeEventHandler}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </div>
      
               
                <div className="pt-1">
                  <Label className="block text-sm font-medium text-slate-700 mb-3">I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'recruiter'].map((role) => (
                      <div key={role}>
                        <input
                          type="radio"
                          id={role}
                          name="role"
                          value={role}
                          checked={input.role === role}
                          onChange={changeEventHandler}
                          className="hidden peer"
                        />
                        <label
                          htmlFor={role}
                          className={`block p-3 text-center text-sm rounded-lg border cursor-pointer transition-all ${
                            input.role === role
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
      
                
                <div className="pt-1">
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors p-6">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">
                          <span className="font-medium text-teal-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG (max. 2MB)</p>
                      </div>
                      <Input
                        accept="image/*"
                        type="file"
                        onChange={changeFileHandler}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
      
                
                <div className="pt-4">
                  {loading ? (
                    <Button
                      disabled
                      className="w-full py-3 bg-teal-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                      Sign Up
                    </Button>
                  )}
                </div>
      
                
                <div className="text-center pt-4">
                  <span className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                    >
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Signup;
