const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sessionmodel = require("../models/session");
const {sendEmail} = require("../services/email");
const otpmodel = require("../models/otp.model");
const {generateOtp, getOtpHtml} = require("../utils/otp");
const googleClient = require("../utils/googleClient");

async function userRegister(req,res){
    try{
        const {name , email , password, confirmPassword} = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).send({msg: "All fields are required"});
        }

        if (password !== confirmPassword) {
            return res.status(400).send({msg: "Passwords do not match"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send({msg : "Email already exists"});
        }
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password,saltRounds);
        
        const user = await User.create({
            name : name,
            email : email,
            password : hashedpassword,
        })

        const otp = generateOtp();
        const html = getOtpHtml(otp);

        const otphash = await bcrypt.hash(otp,10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await otpmodel.create({
            email,
            user : user._id,
            otpHash : otphash,
            expiresAt,
        })

        await sendEmail(email,"OTP verification",`Your OTP code is ${otp}`,html);

        const session = await sessionmodel.create({
            userId : user._id,
            refreshtokenhash : "",
            ip : req.ip,
            userAgent : req.headers["user-agent"]
        })

        const refreshtoken = jwt.sign(
            {id : user._id,sid : session._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "7d"}
        )

        const refreshtokenhash = await bcrypt.hash(refreshtoken,10);
        session.refreshtokenhash = refreshtokenhash;
        await session.save();

        const accesstoken = jwt.sign(
            {id : user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "15m"}
        )

        res.cookie("refreshtoken",refreshtoken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).send({
            msg : "User created successfully",
            user : {name : user.name, email : user.email,verified : user.verified},
            accesstoken
        })
    }
    catch(error){
        return res.status(500).send({
            msg : error.message,
        })
    }
}


async function loginUser(req,res){
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send({msg : "Invalid credentials"});
        }

        if(!user.verified){
            return res.status(401).send({msg : "Email not verified"});
        }

        const isValid = await bcrypt.compare(password,user.password);
        if(!isValid){
            return res.status(401).send({msg : "Invalid Credentials"});
        }

        const session = await sessionmodel.create({
            userId : user._id,
            refreshtokenhash : "",
            ip : req.ip,
            userAgent : req.headers["user-agent"]
        })

        const refreshtoken = jwt.sign(
            {id : user._id,sid : session._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "7d"}
        )

        const refreshtokenhash = await bcrypt.hash(refreshtoken,10);
        session.refreshtokenhash = refreshtokenhash;
        await session.save();

        const accesstoken = jwt.sign(
            {id : user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "15m"}
        )        

        res.cookie("refreshtoken",refreshtoken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).send({
            msg : "User login Successfully",
            user : { name : user.name, email : user.email},
            accesstoken
        })
    } catch (error) {
        return res.status(500).send({
            msg : error.message
        })
    }
}

async function getuser(req,res){
    try {
        const user = req.user;
        if(!user){
            return res.status(404).send({msg : "User not found"});
        }
        return res.status(200).send({
            msg : "User fetched successfully",
            user : user
        })
    } catch (error) {
        return res.status(500).json({
            msg : error.message
        })
    }
}

async function refreshtokenfun(req,res){
    try {
        const refreshtoken = req.cookies?.refreshtoken;
        if(!refreshtoken){
            return res.status(401).json({msg : "Unauthorized User"});
        }

        const decode = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);

        const session = await sessionmodel.findOne({
            _id : decode.sid,
            userId : decode.id,
            revoked : false,
        })
        
        if(!session){
            return res.status(401).json({msg : "Invalid user"});
        }

        let isMatch = await bcrypt.compare(refreshtoken,session.refreshtokenhash);
        if(!isMatch){
            session.revoked = true;
            await session.save();
            return res.status(401).json({msg : "Invalid refresh token, session revoked"});
        }
        
        const newrefreshtoken = jwt.sign(
            {id : decode.id , sid : decode.sid},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "7d"}
        );
        
        const newrefreshtokenhash = await bcrypt.hash(newrefreshtoken,10);
        session.refreshtokenhash = newrefreshtokenhash;
        await session.save();

        const accesstoken = jwt.sign(
            {id : decode.id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "15m"}
        );
        
        res.cookie("refreshtoken",newrefreshtoken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).send({
            msg : "Access token refreshed successfully",
            accesstoken
        })

    } catch (error) {
        return res.status(500).send({
            msg : error.message
        })
    }
}

async function logoutUser(req,res){
    try {
        const refreshtoken = req.cookies?.refreshtoken;
        if(!refreshtoken){
            return res.status(401).send({msg : "Invalid refresh token"});
        }
        const decode = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);
        const session = await sessionmodel.findOne({
            _id : decode.sid,
            userId : decode.id,
            revoked : false
        })
        if(!session){
            return res.status(401).send({msg : "INvalid refresh token"});
        }
        const isValid = await bcrypt.compare(refreshtoken,session.refreshtokenhash);
        if(!isValid){
            return res.status(401).send({msg : "Invalid refresh token"});
        }
        session.revoked = true;
        await session.save();
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",        });
        return res.status(200).send({
            msg : "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg : error.message
        })
    }
}

async function logoutAlluser(req,res){
    const refreshtoken = req.cookies?.refreshtoken;
    if(!refreshtoken){
        return res.status(401).send({msg : "Refreshtoken not found"});
    }
    try {
        const decoded = await jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);
        const session = await sessionmodel.findOne({
            _id : decoded.sid,
            userId : decoded.id,
            revoked : false
        });
        if(!session){
            return res.status(401).send({msg : "Invalid Refresh token"});
        }

        let isMatch = await bcrypt.compare(refreshtoken,session.refreshtokenhash);
        if(!isMatch){
            return res.status(401).send({msg : "Invalid refresh token"});
        }
        await sessionmodel.updateMany({
            userId : decoded.id,
            revoked : false
        },{
            revoked : true,
        })

        res.clearCookie("refreshtoken",{
            httpOnly : true,
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        return res.status(200).send({
            msg : "Logged out from all devices successfully"
        })
    } catch (error) {
        return res.status(500).send({
            msg : error.message,
        })
    }
}

async function verifyOtp(req,res){
    try {
        const {otp , email} = req.body;
        const userotp = await otpmodel.findOne({email});
        if(!userotp){
            return res.status(401).send({msg : "Invalid credentials"});
        }
        if (userotp.expiresAt < new Date()) {
            await otpmodel.deleteOne({ _id: userotp._id });
            return res.status(400).send({ msg: "OTP has expired" });
        }
        const isvalid = await bcrypt.compare(otp,userotp.otpHash);
        if(!isvalid){
            return res.status(400).send({msg : "Invalid OTP"});
        }
        const user = await User.findByIdAndUpdate(
            userotp.user,
            {verified : true},
            {new : true}
        )

        await otpmodel.deleteMany({
            user : userotp.user
        });

        return res.status(200).send({
            msg : "Email verfied successfully",
            user : {
                name : user.name,
                email : user.email,
                verified : user.verified
            }
        })

    } catch (error) {
        return res.status(500).send({
            msg : "Internal server error"
        })
    }
}

async function ResendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ msg: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        if (user.verified) {
            return res.status(400).send({ msg: "Email already verified" });
        }

        // remove any existing OTPs for this user first
        await otpmodel.deleteMany({ user: user._id });

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otphash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await otpmodel.findOneAndUpdate(
            { user: user._id },
            { email, user: user._id, otpHash: otphash, expiresAt },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await sendEmail(email, "OTP verification", `Your OTP code is ${otp}`, html);

        return res.status(200).send({ msg: "OTP resent successfully" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}

async function googleAuthRedirect(req,res){
    const url = googleClient.generateAuthUrl({
        access_type : "offline",
        scope : ["openid","profile","email"],
        prompt : "consent"
    });
    return res.redirect(url);
}

async function googleAuthCallback(req,res){
    try{
        const {code} = req.query;
        if(!code){
            return res.status(400).send({msg : "Authorization code missing"});
        }

        const {tokens} = await googleClient.getToken(code);
        const ticket = await googleClient.verifyIdToken({
            idToken : tokens.id_token,
            audience : process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();
        const {sub : googleId, email, name, email_verified} = payload;

        if(!email_verified){
            return res.status(400).send({msg : "Google email not verified"});
        }

        let user = await User.findOne({email});

        if(user){
            if(!user.googleId){
                user.googleId = googleId;
                user.verified = true;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                verified : true,
            });
        }
        
        const session = await sessionmodel.create({
            userId : user._id,
            refreshtokenhash : "",
            ip : req.ip,
            userAgent : req.headers["user-agent"]
        });

        const refreshtoken = jwt.sign(
            {id : user._id, sid : session._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "7d"}
        );

        const refreshtokenhash = await bcrypt.hash(refreshtoken,10);
        session.refreshtokenhash = refreshtokenhash;
        await session.save();

        res.cookie("refreshtoken",refreshtoken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.redirect(`${process.env.CLIENT_URL}`);

    } catch(error){
        return res.status(500).send({msg : error.message});
    }
}

module.exports = {userRegister, getuser, refreshtokenfun, logoutAlluser, loginUser, logoutUser, verifyOtp, ResendOtp, googleAuthRedirect, googleAuthCallback};