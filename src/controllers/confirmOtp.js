

 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false }
  });

 async function verifyOtp(email, otp) {
   const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
   const user = rows[0];
   const compare = bcrypt.compare(otp, user.otp);
   return compare;
    }



 async function confirmOtp(req, res) {
 try {
 const verified = await verifyOtp(req.body.email, req.body.otp);
 if (verified) {
 return res.json({status: "success"});
  }
 return res.json({status: "don't match"});

 } catch(err) {
  return res.json({status: "internal server error"});
   }

 }

module.exports = confirmOtp;
