import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: "shanubirlashanubirla@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});





router.get("/news", async (req, res) => {
  try {
    const { data } = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "software engineering job",
        apiKey: "6dcc6cbcb5aa45a1a62050b2096c08f0",
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
