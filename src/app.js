
 require("dotenv").config();
 const cors = require("cors");
 const express = require("express");
 const app = express();

 const { Pool } = require("pg");
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false}
   });

 app.use(cors({ origin: "https://domtech.co.ke"}));


 app.use(express.urlencoded({ extended: true}));
 app.use(express.json());


 const authenticateToken = require("./authentication/json.js");


 const registerRouter = require('./routes/registerRouter.js');
 const loginRouter = require("./routes/loginRouter.js");
 const locationsRouter = require("./routes/locations.js");
 const paymentRouter = require("./routes/pay.js");

 app.use("/", locationsRouter);
 app.use("/register", registerRouter);
 app.use("/login", loginRouter);
 app.use("/pay", paymentRouter);


app.post("/status", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { rows } = await pool.query(
      'SELECT status FROM users WHERE email = $1',
      [email]
    );

    const status = rows[0];

    if (!status) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});


app.get("/profile", authenticateToken, (req, res) => {
  return res.status(200).json(req.user);
});




 app.listen(process.env.PORT || 3000, () => console.log("server running at port 3000"));




