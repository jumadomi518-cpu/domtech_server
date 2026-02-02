
 const { Router } = require("express");
 const loginRouter = Router();
 const passport = require("../authentication/passport.js");




 loginRouter.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
  if (err) {
  return res.status(500).json({ message: "server error"});
    }
  if (!user) {
  return res.status(401).json({
    success: false,
    message: info.message

     });
   }

 req.login(user, (err) => {
  if (err) {
   return res.status(500).json({ message: "Log in failed"});
    }

  return res.status(200).json({

     success: true,
     message: "Login successful",
     userInfo: { name: user.name, phone: user.phone, email: user.email, role: user.role }

          });
        });

      })(req, res, next);

    });


module.exports = loginRouter;
