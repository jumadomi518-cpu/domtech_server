
 require("dotenv").config();
 const cors = require("cors");
 const express = require("express");
 const app = express();
 const session = require("express-session");
 const pgSession = require("connect-pg-simple")(session);
 const { Pool } = require("pg");
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
  });

 app.set("trust proxy", 1);

 app.use(session({
  store: new pgSession({
   pool,
   tableName: "session",
   createTableIfNotExist: true
    }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
 cookie: {
  maxAge: 30 * 24 * 60 * 60 * 1000
   }
  }));


 app.use(cors({ origin: "http://localhost:7700", credentials: true}));
 app.use(express.urlencoded({ extended: true}));
 app.use(express.json());


 const passport = require("./authentication/passport.js");

 app.use(passport.initialize());
 app.use(passport.session());

 const registerRouter = require('./routes/registerRouter.js');
 const loginRouter = require("./routes/loginRouter.js");
 const locationsRouter = require("./routes/locations.js");
 const paymentRouter = require("./routes/pay.js");

 app.use("/", locationsRouter);
 app.use("/register", registerRouter);
 app.use("/login", loginRouter);
 app.use("/pay", paymentRouter);
 app.get("/profile", async (req, res) => {
  try {
    console.log("session", req.session);
    console.log("user", req.user);
    if (!req.user) {
    return res.status(500).json({ message: "Not logged in"});
       }
   const { rows } = await pool.query("SELECT name, phone, email FROM users WHERE user_id = $1", [req.user.user_id]);
    return res.status(200).json(rows[0]);
        } catch (err) {
    return res.status(500).json({ message: "an error occured"});
        }
     });
 app.listen(process.env.PORT || 3000, () => console.log("server running at port 3000"));
