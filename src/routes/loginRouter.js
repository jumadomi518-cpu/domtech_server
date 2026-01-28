
 const { Router } = require("express");
 const loginRouter = Router();
 const passport = require("../authentication/passport.js");




 loginRouter.post("/", passport.authenticate('local'), (req, res) => {
   res.json({ status: "success"});
   });


module.exports = loginRouter;
