const { Router } = require("express");
const loginRouter = Router();
const passport = require("../authentication/passport.js");
const jwt = require("jsonwebtoken");

loginRouter.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ success: false, message: info.message });

    const token = jwt.sign(
      { userId: user.user_id, name: user.name, phone: user.phone, email: user.email },
      process.env.SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  })(req, res, next);
});

module.exports = loginRouter;
