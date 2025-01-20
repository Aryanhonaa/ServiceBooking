const serviceModel = require('../models/serviceProvider.model');
const cloudinary = require('../config/cloudinary');
const jwt=require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();

const signToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:'7d',
  })
};
exports.addProvider = async (req, res) => {
  try {
    const { name, email, password, speciality, experience, phone, about, fees, address } = req.body;

    // Check if the service provider already exists
    const serviceP = await serviceModel.findOne({ email });
    if (serviceP) {
      return res.status(401).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Extract files from the request
    const image1 = req.files['image1'] ? req.files['image1'][0] : null;
    const image2 = req.files['image2'] ? req.files['image2'][0] : null;
    const image3 = req.files['image3'] ? req.files['image3'][0] : null;

    if (!req.files || !image1 || !image2 || !image3) {
      return res.status(400).json({
        message: "All three images are required",
        success: false,
      });
    }

    // Upload images to Cloudinary
    let image1Upload, image2Upload, image3Upload;
    try {
      image1Upload = await cloudinary.uploader.upload(image1.path, { resource_type: 'image' });
      console.log("Image 1 Uploaded to Cloudinary:", image1Upload.secure_url);

      image2Upload = await cloudinary.uploader.upload(image2.path, { resource_type: 'image' });
      console.log("Image 2 Uploaded to Cloudinary:", image2Upload.secure_url);

      image3Upload = await cloudinary.uploader.upload(image3.path, { resource_type: 'image' });
      console.log("Image 3 Uploaded to Cloudinary:", image3Upload.secure_url);
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err.message);
      return res.status(500).json({
        message: "Failed to upload images to Cloudinary",
        error: err.message,
        success: false,
      });
    }

    // Create a new service provider document
    const newServiceP = new serviceModel({
      name,
      email,
      password,
      speciality,
      experience,
      phone,
      about,
      fees,
      address: JSON.parse(address), // Fixed JSON parsing
      date: Date.now(),
      image: image1Upload.secure_url,
      citizenF: image2Upload.secure_url,
      citizenB: image3Upload.secure_url,
    });

    // Save the new service provider to the database
    try {
      await newServiceP.save();
      return res.status(200).json({
        message: "Service Provider Created Successfully",
        success: true,
      });
    } catch (err) {
      console.error("Error saving to database:", err.message);
      return res.status(400).json({
        message: "Error saving Service Provider to the database",
        error: err.message,
        success: false,
      });
    }
  } catch (err) {
    console.error("Error in addProvider:", err.message);
    return res.status(400).json({
      message: "Error in addProvider",
      error: err.message,
      success: false,
    });
  }
};


exports.login=async (req,res) => {
  try{
    const{email,password}=req.body;

    if(!email || !password){
      return res.status(400).send({
        message:"Please enter both email and password",
        success:false
      })
    }
    const user=await userModel.findOne({email}).select("+password");

    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const token=signToken(user._id);

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,//7 days
      httpOnly:true,
      sameSite:'true',
      secure:process.env.NODE_ENV ==="production",
    })

    res.status(200).json({
      success:true,
      user
    })
  }catch(err){
    res.status(500).json({
      message:"Error in login",
      err:err.message
    })
  }
  
}


exports.logout=async(req,res)=>{
  res.clearCookie("jwt");
  res.status(200).json({success:true, message:"Logged out successfully"});
}