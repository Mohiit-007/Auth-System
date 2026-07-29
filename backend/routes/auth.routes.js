const express = require("express");
const router = express.Router();
const {userRegister, refreshtokenfun, logoutAlluser,
        loginUser, logoutUser, verifyOtp, ResendOtp,
     googleAuthRedirect, googleAuthCallback} = require("../controller/auth.controller");

router.post("/register",userRegister);
router.post("/login",loginUser);
router.get("/refresh-token",refreshtokenfun);
router.get("/logout-all",logoutAlluser);
router.get("/logout",logoutUser);
router.post("/verify-otp",verifyOtp);
router.post("/resend-otp",ResendOtp);
router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

module.exports = router;