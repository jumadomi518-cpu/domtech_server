
 require("dotenv").config();
 const cors = require("cors");
 const express = require("express");
 const app = express();

 app.use(cors());
 app.use(express.urlencoded({ extended: true}));
 app.use(express.json());

 const registerRouter = require('./routes/registerRouter.js');


 app.use("/register", registerRouter);


 app.listen(process.env.PORT || 3000, () => console.log("server running at port 3000"));
