import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  RefreshCw,
  Loader2,
  Users,
  Briefcase,
  Bookmark,
  FileText,
} from "lucide-react";
import Navbar from "../shared/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setAllApplicants } from "@/redux/applicationSlice.js";
import {
  ADMIN_API_END_POINT,
  USER_API_END_POINT,
  APPLICATION_API_END_POINT,
} from "@/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, studentsRes, recruitersRes, companiesRes] = await Promise.all([
        axios.get(`${ADMIN_API_END_POINT}/stats`),
        axios.get(`${ADMIN_API_END_POINT}/students`),
        axios.get(`${ADMIN_API_END_POINT}/recruiters`),
        axios.get(`${ADMIN_API_END_POINT}/companies`),
      ]);

      setStats(statsRes.data);
      setStudents(studentsRes.data || []);
      setRecruiters(recruitersRes.data || []);
      setCompanies(companiesRes.data || []);
      setLastUpdated(new Date());

      if (params.id) {
        const applicantsRes = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`
        );
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
            const res = await axios.get(
              `${USER_API_END_POINT}/getName/${c.userId}`
            );
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

  const chartData = {
    labels: ["Students", "Recruiters", "Admins"],
    datasets: [
      {
        data: [stats.totalStudents || 0, stats.totalRecruiters || 0, 1],
        backgroundColor: ["#14b8a6", "#6366f1", "#f43f5e"],
        borderColor: ["#0f766e", "#4f46e5", "#be123c"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 ">
      <Navbar />
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 md:p-8 gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 shadow transition text-sm"
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} size={18} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {[
          ["Students", stats.totalStudents, Users],
          ["Recruiters", stats.totalRecruiters, Briefcase],
          ["Jobs", stats.totalJobs, Bookmark],
          ["Applications", stats.totalApplications, FileText],
        ].map(([label, value, Icon], idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 p-6 flex items-center gap-4"
          >
            <div className="bg-teal-100 text-teal-700 rounded-full p-3">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                {label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Smaller Pie Chart */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h2>
        <div className="flex justify-center">
          <div className="w-[200px] h-[200px]">
            <Pie data={chartData} />
          </div>
        </div>
      </div>

      {/* Students & Recruiters Table */}
      {[{ label: "Students", data: students, type: "student" }, { label: "Recruiters", data: recruiters, type: "recruiter" }].map((section, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-md border border-gray-100 mb-12 overflow-x-auto"
        >
          <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {section.label} ({section.data.length})
            </h2>
          </div>
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
              {section.data.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-4">{u.fullname}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        axios.patch(`${ADMIN_API_END_POINT}/${u._id}/toggle-status`).then(() => fetchData());
                      }}
                      className={`px-3 py-1 rounded text-xs text-white ${
                        u.status === "active" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {u.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Companies Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-12 overflow-x-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Companies ({companies.length})
          </h2>
        </div>
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
  );
};

export default Dashboard;
