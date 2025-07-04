import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar.jsx'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/constants.js'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice.js'
import { Loader2 } from 'lucide-react'


import { Mail, Lock } from 'lucide-react';
const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
  <Navbar />
  <div className="flex-grow flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Sign in to access your dashboard</p>
      </div>
      
      <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="space-y-5">
         
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
            <div className="grid grid-cols-3 gap-3">
              {['student', 'recruiter', 'admin'].map((role) => (
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
                    className={`block p-2 text-center text-sm rounded-lg border cursor-pointer transition-all ${
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

          
          <div className="pt-4">
            {/* {loading ? (
              <Button
                disabled
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-lg flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Sign In
              </Button>
            )} */}
            <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Sign In
              </Button>
          </div>

        
          <div className="text-center pt-4">
            <span className="text-sm text-slate-500">
              New user?{' '}
              <Link
                to="/signup"
                className="font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              >
                Create account
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


export default Login