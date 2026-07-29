const express = require("express")
const router = express.Router();
const {getuser} = require("../controller/auth.controller");
const {authusermiddleware} = require("../middleware/user.auth");

router.get("/get-me",authusermiddleware,getuser);

module.exports = router;