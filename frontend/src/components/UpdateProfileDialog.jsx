import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Upload, User, FileText, Award, X } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/constants.js';
import { setUser } from '@/redux/authSlice.js';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills || [],
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const addSkill = () => {
    if (newSkill.trim() && !input.skills.includes(newSkill.trim())) {
      setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setInput({ ...input, skills: input.skills.filter((s) => s !== skill) });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('bio', input.bio);
    formData.append('skills', input.skills.join(','));
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text mb-4">
          Edit Profile
        </h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('personal')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              tab === 'personal'
                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <User className="inline w-4 h-4 mr-1" />
            Personal
          </button>
          <button
            onClick={() => setTab('skills')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              tab === 'skills'
                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Award className="inline w-4 h-4 mr-1" />
            Skills
          </button>
          <button
            onClick={() => setTab('resume')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              tab === 'resume'
                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <FileText className="inline w-4 h-4 mr-1" />
            Resume
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          {tab === 'personal' && (
            <>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  rows="3"
                  className="w-full border rounded px-3 py-2 mt-1"
                ></textarea>
              </div>
            </>
          )}

          {tab === 'skills' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-2 border rounded text-sm"
                  disabled={!newSkill.trim()}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {input.skills.length > 0 ? (
                  input.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="flex items-center bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-600"
                        onClick={() => removeSkill(skill)}
                      />
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills added yet.</p>
                )}
              </div>
            </>
          )}

          {tab === 'resume' && (
            <>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="hidden"
                  id="resumeUpload"
                />
                <label
                  htmlFor="resumeUpload"
                  className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium"
                >
                  Upload Resume (PDF)
                </label>
                {input.file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {input.file.name}
                  </p>
                )}
              </div>
              {user?.profile?.resume && (
                <div className="bg-gray-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-gray-600">Current Resume:</p>
                  <p className="font-medium">{user.profile.resumeOriginalName}</p>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileDialog;
