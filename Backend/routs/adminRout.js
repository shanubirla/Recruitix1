import express from "express";
import {
  getAdminStats,
  getAllStudents,
  getAllRecruiters,
  getAllJobs,
  getAllCompanies,
  toggleUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();


router.get("/stats", getAdminStats); 
router.get("/students", getAllStudents); 
router.get("/recruiters", getAllRecruiters);
router.get("/jobs", getAllJobs);
router.get("/companies", getAllCompanies); 
router.patch("/:id/toggle-status", toggleUserStatus); 

export default router;
