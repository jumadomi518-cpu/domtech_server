
 require("dotenv").config();
 const cors = require("cors");
 const express = require("express");
 const app = express();
 const session = require("express-session");
 app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
  }));


 app.use(cors());
 app.use(express.urlencoded({ extended: true}));
 app.use(express.json());


 const registerRouter = require('./routes/registerRouter.js');
 const passport = require("./authentication/passport.js");
 app.use(passport.session());
 const loginRouter = require("./routes/loginRouter.js");
 const locationsRouter = require("./routes/locations.js");
 const paymentRouter = require("./routes/pay.js");

 app.use("/", locationsRouter);
 app.use("/register", registerRouter);
 app.use("/login", loginRouter);
 app.use("/pay", paymentRouter);

 app.listen(process.env.PORT || 3000, () => console.log("server running at port 3000"));
