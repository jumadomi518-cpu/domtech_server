

 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false }
 });

 async function addUser(user) {
 const { name, phone, email, password } = user;
 const hashedPassword = await bcrypt.hash(password, 10);
 const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
 if (rows.length > 0) {
 return "user exists";
 }
 await pool.query("INSERT INTO users (name, phone, email, password) VALUES ($1, $2, $3, $4)", [ name, phone, email, hashedPassword]);
 return "user added successfully";
 }


module.exports = addUser;
