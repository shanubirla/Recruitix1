import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Upload, User, FileText, Award, X } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/constants.js';
import { setUser } from '@/redux/authSlice.js';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [newSkill, setNewSkill] = useState('');
    const [tab, setTab] = useState('personal');

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills || [],
        file: null
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const addSkill = () => {
        if (newSkill.trim() && !input.skills.includes(newSkill.trim())) {
            setInput({ 
                ...input, 
                skills: [...input.skills, newSkill.trim()] 
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setInput({
            ...input,
            skills: input.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills.join(','));

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text mb-4">
                    Update Your Profile
                </h2>

                <div className="flex gap-2 mb-4">
                    <button onClick={() => setTab('personal')} className={`flex items-center gap-2 px-3 py-2 rounded-md ${tab === 'personal' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                        <User className="h-4 w-4" /> Personal
                    </button>
                    <button onClick={() => setTab('skills')} className={`flex items-center gap-2 px-3 py-2 rounded-md ${tab === 'skills' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                        <Award className="h-4 w-4" /> Skills
                    </button>
                    <button onClick={() => setTab('resume')} className={`flex items-center gap-2 px-3 py-2 rounded-md ${tab === 'resume' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                        <FileText className="h-4 w-4" /> Resume
                    </button>
                </div>

                <form onSubmit={submitHandler} className="space-y-4">
                    {tab === 'personal' && (
                        <div className="space-y-4">
                            <div>
                                <label>Full Name</label>
                                <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label>Phone Number</label>
                                <input type="tel" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label>Bio</label>
                                <textarea name="bio" value={input.bio} onChange={changeEventHandler} rows="4" className="w-full border rounded px-3 py-2"></textarea>
                            </div>
                        </div>
                    )}

                    {tab === 'skills' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a skill and press Enter"
                                    className="flex-1 border rounded px-3 py-2"
                                />
                                <button type="button" onClick={addSkill} className="px-4 py-2 border rounded" disabled={!newSkill.trim()}>
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {input.skills.length > 0 ? (
                                    input.skills.map((skill, index) => (
                                        <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1">
                                            {skill}
                                            <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => removeSkill(skill)} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No skills added yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === 'resume' && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                                <input type="file" accept="application/pdf" onChange={fileChangeHandler} className="hidden" id="resumeUpload" />
                                <label htmlFor="resumeUpload" className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                                    Choose PDF file
                                </label>
                                <p className="text-sm text-gray-500 mt-1">Max file size: 10MB</p>
                                {input.file && <p className="text-sm text-green-600 mt-2">Selected: {input.file.name}</p>}
                            </div>

                            {user?.profile?.resume && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Current resume:</p>
                                    <p className="font-medium">{user.profile.resumeOriginalName}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 border rounded"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileDialog;
