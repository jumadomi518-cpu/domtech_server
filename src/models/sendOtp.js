
 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false}
   });

 const axios = require("axios");
 async function saveOtp(otp, email) {
 const hashedOtp = await bcrypt.hash(otp.toString(), 10);
 const now = new Date();
 const expiry = now.setMinutes(now.getMinutes() + 5);
 await pool.query("UPDATE users set otp = $1, expires_at = $2 WHERE email = $3", [hashedOtp, expiry, email]);
 console.log("otp saved successfully");
  }


 const nodemailer = require("nodemailer");

 async function sendOtp(email) {

 const otp = Math.floor(Math.random() * 989989 + 111111);
   await saveOtp(otp, email);






  const res = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "DomTech", email: "domtechpay@gmail.com" },
      to: [{ email: email }],
      subject: "Email Address Verification",
      htmlContent: `<p>Dear Lovely User</p><p>Use the following One Time Password to verify your Email address</p><p><b>OTP:</b> ${otp}</p>`
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  console.log("Email sent", res.data);
  }

module.exports = sendOtp;
