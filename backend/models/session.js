const mongoose = require("mongoose");

const sessionmodel = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    refreshtokenhash : {
        type : String,
        reuqired : true,
    },
    ip : {
        type : String,
        required : true,
    },
    userAgent : {
        type : String,
        required : true,
    },
    revoked : {
        type : Boolean,
        default : false
    }
},{timestamps : true});

const session = mongoose.model("session",sessionmodel);
module.exports = session;