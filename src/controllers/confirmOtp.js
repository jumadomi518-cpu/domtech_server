

 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false }
  });

 async function verifyOtp(email, otp) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) {
    return "User not found";
  }
  if (Date.now() > new Date(user.expires_at).getTime()) {
    return "Otp expired";
  }
  const compare = await bcrypt.compare(otp, user.otp);
  return compare;
}



 async function confirmOtp(req, res) {
 try {
 const verified = await verifyOtp(req.body.email, req.body.otp);
 if (verified) {
 await pool.query("UPDATE users SET status = $1 WHERE email = $2", ["verified", req.body.email]);
 return res.json({status: "success"});
  }

 if (verified === "Otp expired") {
 return res.json({status: "Otp expired"});
  }
 return res.json({status: "don't match"});

 } catch(err) {
  return res.json({status: "internal server error"});
   }

 }

module.exports = confirmOtp;
