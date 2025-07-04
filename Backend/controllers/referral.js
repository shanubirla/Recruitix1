import crypto from 'crypto';
import dotenv from 'dotenv';
import { Referral } from '../Models/Referral.js'
import PaymentHistory from '../Models/Payment.model.js';
import sendEmail from '../utils/sendEmail.js';
import Razorpay from 'razorpay';
import getDataUri from "../utils/DataUri.js";
import cloudinary from "../utils/Cloudinary.js";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});










export const createOrder = async (req, res) => {
  const { amount, studentName, studentEmail, companyRequested, resume, referralId } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${new Date().getTime()}`,
      notes: { studentName, studentEmail, companyRequested, resume, referralId },
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


export const verifyPayment = async (req, res) => {
  console.log(process.env.RAZORPAY_KEY_SECRET)
  const { razorpay_payment_id, orderId, razorpay_signature } = req.body;
  console.log(razorpay_payment_id, orderId, razorpay_signature,)
  const body = `${orderId}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (razorpay_signature === expectedSignature) {
    const order = await razorpay.orders.fetch(orderId);
    console.log(order)
    const { studentName, studentEmail, companyRequested, referralId  , resume} = order.notes;
    console.log(studentName, studentEmail, companyRequested, referralId)
    const amount = order.amount / 100;

    const paymentRecord = new PaymentHistory({
      paymentId: razorpay_payment_id,
      orderId,
      studentName,
      studentEmail,
      referralId,
      companyRequested,
      amount,
    });


    await paymentRecord.save();

    const referral = await Referral.findById(referralId);
    sendEmail(
      'Referral Payment Successful',
      studentEmail,
      `Dear ${studentName},  
      
      Your payment for a referral to **${companyRequested}** has been successfully processed.  
      
      Here are the details of your assigned referral contact:  
      - **Name:** ${referral.name}  
      - **Email:** ${referral.email}  
      - **Company:** ${companyRequested}  
      
      You may now reach out to them via email regarding your referral. Be professional and attach your updated resume.  
      
      Best of luck with your application!  
      
      Regards,  
      JobGenie`
    );

    sendEmail(
      'New Referral Request',
      referral.email,
      `Dear ${referral.name},  
      
      You have a new referral request from **${studentName}**. Here are their details:  
      - **Name:** ${studentName}  
      - **Email:** ${studentEmail}  
      - **Company Requested:** ${companyRequested}  
      - **Resume:** ${resume} 
      
      Please review their profile and assist them with the referral process. You may contact them directly for further discussion.  
      
      Best Regards,  
      Recruitix`
    );


    res.status(200).json({ success: true, message: 'Payment successfully verified' });
  } else {
    res.status(400).json({ success: false, error: 'Payment verification failed' });
  }
};


export const referralReq = async (req, res) => {
  const { referralId, studentName, studentEmail, resume, companyRequested } = req.body;
  if (!studentName || !studentEmail || !resume || !companyRequested || !referralId) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const referral = await Referral.findById(referralId);
    if (referral.referralsProvidedThisWeek >= referral.referralLimitPerWeek) {
      return res.status(400).json({ success: false, message: 'Referral limit reached for this week.' });
    }

    referral.referralsProvidedThisWeek += 1;
    await referral.save();

    sendEmail(
      'Referral Request Processed',
      studentEmail,
      `Your referral for ${companyRequested} has been successfully sent.`
    );

    sendEmail(
      'Referral Request Received',
      referral.email,
      `${studentName} has requested a referral for ${companyRequested}.`
    );

    res.status(200).json({ success: true, message: 'Referral request sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};




export const addRef = async (req, res) => {
  try {
    const { name, companyName, position, fee, email } = req.body;

    const file = req.file;
    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.uploader.upload(fileUri.content);

    const referral = new Referral({
      name,
      profilePhoto: myCloud.secure_url,
      companyName,
      position,
      fee,
      email,
    });

    await referral.save();

    res.status(201).json({ message: "Referral added successfully", referral });
  } catch (error) {
    console.error("Error adding referral:", error);
    res.status(500).json({ message: "Failed to add referral" });
  }
};
export const getAllReferral = async (req, res) => {
  try {
    const referrals = await Referral.find();
    res.json(referrals);
  } catch (error) {
    res.status(500).send('Error retrieving referrals.');
  }
};

