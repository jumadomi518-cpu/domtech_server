
 require("dotenv").config();
 const cors = require("cors");
 const express = require("express");
 const app = express();



 app.use(cors({ origin: "http://localhost:7700"}));


 app.use(express.urlencoded({ extended: true}));
 app.use(express.json());


 const authenticateToken = require("./authentication/json.js");
 app.use(passport.initialize());

 const registerRouter = require('./routes/registerRouter.js');
 const loginRouter = require("./routes/loginRouter.js");
 const locationsRouter = require("./routes/locations.js");
 const paymentRouter = require("./routes/pay.js");

 app.use("/", locationsRouter);
 app.use("/register", registerRouter);
 app.use("/login", loginRouter);
 app.use("/pay", paymentRouter);


app.get("/profile", authenticateToken, (req, res) => {
  return res.status(200).json(req.user);
});




 app.listen(process.env.PORT || 3000, () => console.log("server running at port 3000"));




