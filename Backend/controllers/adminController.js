import { User } from "../Models/usermodel.js";
import { Job } from "../Models/jobModel.js";
import { Application } from "../Models/application.js";
import { Company } from '../Models/companyModel.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();


    const stats = await Application.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyApplications = {};
    stats.forEach(item => {
      const year = item._id.year;
      const month = String(item._id.month).padStart(2, "0");
      monthlyApplications[`${year}-${month}`] = item.count;
    });

    res.status(200).json({
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalCompanies,
      monthlyApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch admin stats", error });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate({
        path: 'applications.job',
        select: 'title company',
      });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' })
      .populate({
        path: 'profile.company',
        populate: { path: 'jobs', select: 'title description' }
      });
    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recruiters', error });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name')
      .select('title description status company');

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }

};
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()


    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};



export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false
      });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    return res.status(200).json({
      message: `User ${user.status === "active" ? "unblocked" : "blocked"} successfully.`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};