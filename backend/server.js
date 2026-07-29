require("dotenv").config();
const app = require("./app");
const {connectdb} = require("./db/Connectdb");

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file");
}

connectdb();
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});