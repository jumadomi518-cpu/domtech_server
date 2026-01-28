
 const { Router } = require("express");
 const loginRouter = Router();
 const passport = require("../authentication/passport.js");

 loginRouter.get("/success", (req, res) => {
 res.json({ status: "success"});
   });

 loginRouter.get("/fail", (req, res) => {
   res.json({ status: "fail"});
   });




 loginRouter.post("/", passport.authenticate('local', { successRedirect: "/success", failureRedirect: "/fail"}));


module.exports = loginRouter;
