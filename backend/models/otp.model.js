const mongoose = require("mongoose");

const otpmodel = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    otpHash : {
        type : String,
        required : true,
    },
    expiresAt : {
        type : Date,
        required : true,
    }
},{timestamps : true});

otpmodel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpmodel.index({ user: 1 }, { unique: true });

const otp = mongoose.model("otp",otpmodel);
module.exports = otp;