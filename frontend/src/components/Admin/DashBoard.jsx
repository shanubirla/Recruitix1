import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { ADMIN_API_END_POINT, USER_API_END_POINT, APPLICATION_API_END_POINT } from "@/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice.js";
import { RefreshCw, Loader2, Users, Briefcase, Bookmark, FileText, Building } from "lucide-react";
import Navbar from "../shared/Navbar.jsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { applicants } = useSelector((state) => state.application);
  const dispatch = useDispatch();
  const params = useParams();

  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, studentsRes, recruitersRes, jobsRes, companiesRes] = await Promise.all([
        axios.get(`${ADMIN_API_END_POINT}/stats`),
        axios.get(`${ADMIN_API_END_POINT}/students`),
        axios.get(`${ADMIN_API_END_POINT}/recruiters`),
        axios.get(`${ADMIN_API_END_POINT}/jobs`),
        axios.get(`${ADMIN_API_END_POINT}/companies`)
      ]);

      setStats(statsRes.data);
      setStudents(studentsRes.data || []);
      setRecruiters(recruitersRes.data || []);
      setJobs(jobsRes.data || []);
      setCompanies(companiesRes.data || []);
      setLastUpdated(new Date());

      if (params.id) {
        const applicantsRes = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`);
        dispatch(setAllApplicants(applicantsRes.data.job));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchNames = async () => {
      const names = {};
      for (const c of companies) {
        if (!userNames[c.userId]) {
          try {
            const res = await axios.get(`${USER_API_END_POINT}/getName/${c.userId}`);
            if (res.data.success) names[c.userId] = res.data.userName;
          } catch (err) {
            console.log(err);
          }
        }
      }
      setUserNames((prev) => ({ ...prev, ...names }));
    };
    if (companies.length) fetchNames();
  }, [companies]);

  const handleToggleStatus = async (userId, type) => {
    try {
      const res = await axios.patch(`${ADMIN_API_END_POINT}/${userId}/toggle-status`);
      if (res.data.success) {
        const update = (arr) =>
          arr.map((u) =>
            u._id === userId ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u
          );
        type === "student" ? setStudents(update) : setRecruiters(update);
      }
    } catch (e) {
      console.log("Toggle status error:", e);
    }
  };

  const getMonthlyLabels = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date().getMonth();
    const past6 = [];
    for (let i = 5; i >= 0; i--) {
      past6.push(months[(now - i + 12) % 12]);
    }
    return past6;
  };

  const chartData = {
    userDistribution: {
      labels: ["Students", "Recruiters", "Admins"],
      datasets: [
        {
          data: [stats.totalStudents || 0, stats.totalRecruiters || 0, 1],
          backgroundColor: ["#14b8a6", "#6366f1", "#f43f5e"],
          borderColor: ["#0f766e", "#4f46e5", "#be123c"],
          borderWidth: 1,
        },
      ],
    },
    monthlyApplications: {
      labels: getMonthlyLabels(),
      datasets: [
        {
          label: "Applications",
         data: getMonthlyLabels().map((m) => {
  const key = m.toLowerCase();
  return stats?.monthlyApplications && key in stats.monthlyApplications
    ? stats.monthlyApplications[key]
    : 0;
}),


          backgroundColor: "#14b8a6",
          borderRadius: 4,
        },
      ],
    },
    
  };
  console.log(chartData.monthlyApplications);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }
 
  return (
    
    <div className="bg-slate-50 min-h-screen p-0">
      <Navbar/>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated at {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} size={18} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[["Students", stats.totalStudents, Users], ["Recruiters", stats.totalRecruiters, Briefcase], ["Jobs", stats.totalJobs, Bookmark], ["Applications", stats.totalApplications, FileText]].map(
          ([label, value, Icon], i) => (
            <div key={i} className="p-4 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center gap-4">
              <Icon className="text-teal-600 w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-semibold text-gray-800">{value || 0}</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h2>
          <div className="h-64">
            <Pie data={chartData.userDistribution} />
          </div>
        </div>
        
      </div>

      {/* Tables */}
      <div className="space-y-8">
        {/* Students */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h2 className="p-4 text-xl font-semibold text-gray-800 border-b">Students ({students.length})</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="p-4">{s.fullname}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(s._id, "student")}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        s.status === "active" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {s.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recruiters */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h2 className="p-4 text-xl font-semibold text-gray-800 border-b">Recruiters ({recruiters.length})</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50">
                  <td className="p-4">{r.fullname}</td>
                  <td className="p-4">{r.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(r._id, "recruiter")}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        r.status === "active" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {r.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Companies */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h2 className="p-4 text-xl font-semibold text-gray-800 border-b">Companies ({companies.length})</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Recruiter</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.location}</td>
                  <td className="p-4">{userNames[c.userId] || "Loading..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
