const mongoose = require("mongoose");

async function connectdb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongodb connected");
    })
    .catch((err)=>{
        console.log(err,"Database connection error");
    })
};

module.exports = {connectdb};