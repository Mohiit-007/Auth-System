const User = require("../models/user");

async function authusermiddleware(req,res,next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized. Please login." });
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decode.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = {authusermiddleware};