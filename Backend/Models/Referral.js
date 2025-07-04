
import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
    name: String,
    profilePhoto: String,
    companyName: String,
    position: String,

    fee: Number,
    email: { type: String, default: "shanubirlashanubirla@gmail.com" },
});
;
export const Referral = mongoose.model('Referral', referralSchema);
