import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
    applications: [
        {
            job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            status: { type: String, default: 'pending' },
        },
    ],
}, { timestamps: true });
console.log("Defining User model...");
export const User = mongoose.models.User || mongoose.model("User", userSchema);