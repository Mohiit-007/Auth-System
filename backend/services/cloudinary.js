import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const uploadOncloudinary = async (filepath)=>{
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filepath);
        return uploadResult.secure_url;
    } catch (error) {
        fs.unlinkSync(filepath);
        return res.status(500).json({msg : "Internal Server Error"});    
    }   
}

module.exports = {uploadOncloudinary};