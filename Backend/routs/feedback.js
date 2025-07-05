import express from "express";
const router = express.Router();

import {postFeedBack , getRecentFeedBack} from '../controllers/feebback.js';
router.route("/post").post(postFeedBack);
router.route("/get").get(getRecentFeedBack);
export default router;

