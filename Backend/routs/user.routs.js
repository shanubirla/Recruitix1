import express from "express";
import { login, logout, register, updateProfile, getUserNameById } from "../controllers/usercontroller.js";
import isAuthenticated from "../middlewares/isAuth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/getName/:id").get(getUserNameById);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;
