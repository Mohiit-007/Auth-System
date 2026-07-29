const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        trim : true,
    },
    googleId:{
        type : String,
    },
    verified :{
        type : Boolean,
        default : false
    }
},{timestamps : true});

const User = mongoose.model("user",userSchema);
module.exports = User;