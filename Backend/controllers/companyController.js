import { Company } from "../Models/companyModel.js";
import getDataUri from "../utils/DataUri.js";
import cloudinary from "../utils/Cloudinary.js";
import { Job } from '../Models/jobModel.js';
import { Application } from "../Models/application.js";
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        (error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}
export const deleteCompany = async (req, res) => {
    try {
        const company = req.params.id;
        console.log(`Deleting company with ID: ${company}`);


        const jobsToDelete = await Job.find({ company });
        console.log(`Jobs associated with this company:`, jobsToDelete);
        await Application.deleteMany({ job: jobsToDelete._id });

        if (jobsToDelete.length > 0) {
            await Job.deleteMany({ company });
            console.log(`Deleted ${jobsToDelete.length} jobs associated with company.`);
        } else {
            console.log('No jobs found for this company.');
        }


        const deletedCompany = await Company.findByIdAndDelete(company);

        if (!deletedCompany) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }

        res.status(200).json({ success: true, message: 'Company account and all related data have been deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting company account.' });
    }
}