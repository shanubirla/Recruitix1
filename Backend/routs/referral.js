import express from "express";
import {getAllReferral ,  createOrder, verifyPayment, referralReq , addRef} from "../controllers/referral.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route('/getRef').get(getAllReferral);
router.route('/reqRef').post(referralReq);
router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);
router.post('/addRef',singleUpload, addRef);
export default router;






