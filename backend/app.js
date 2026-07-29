const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const authrouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieparser());

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use("/auth",authrouter);
app.use("/user",userRouter);

module.exports = app;