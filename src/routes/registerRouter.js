
 const { Router } = require("express");
 const registerRouter = Router();
 const registerController = require('../controllers/registerController.js');
 const confirmOtpController = require('../controllers/confirmOtp.js');




 registerRouter.post("/", registerController);

 registerRouter.post("/confirmOtp", confirmOtpController);




 module.exports = registerRouter;

