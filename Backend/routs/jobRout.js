import express from "express";
import isAuthenticated from "../middlewares/isAuth.js";
import {
  getAdminJobs,
  deleteJob,
  getAllJobs,
  getJobById,
  postJob
} from "../controllers/jobcontroller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs); // ✅ PUBLIC
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;
