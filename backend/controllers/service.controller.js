const serviceModel = require('../models/serviceProvider.model');
const cloudinary = require('../config/cloudinary');
const jwt=require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();
const TempUserModel= require('../models/TempUser.model');
const nodemailer=require('nodemailer');
const TempServiceModel=require('../models/tempService.modal');
const bcrypt= require('bcrypt');
const signToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:'7d',
  })
};


const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
})
exports.addProvider = async (req, res) => {
  try {
    const { firstName,middleName, lastName, email, password,category, speciality, experience, phone, about, fees, address } = req.body;

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
    const newServiceP = new TempServiceModel({
      firstName,
      middleName,
      lastName,
      email,
      password,
      category,
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
        message: "Service Provider Added To verify Successfully",
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
    const user=await serviceModel.findOne({email})

    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const token=signToken(user._id);

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,//7 days
      httpOnly:true,
      sameSite:'strict',
      secure:process.env.NODE_ENV ==="production",
    })

    res.status(200).json({
      success:true,
      user,
      token
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




exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    let existingUser= await serviceModel.findOne({email});
  
    if(existingUser){
      return res.status(400).json({success:false, message: "Email already exists" });
    }

      
    // Check if a pending email verification exists
    let tempUser = await TempUserModel.findOne({ email });
    if (tempUser) {
      // Generate a new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      tempUser.verificationCode = verificationCode;
      await tempUser.save(); // Update the verification code

      // Send the email again with the new verification code
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
  html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">Hi,</p>
          <p style="font-size: 16px; color: #555;">You requested a email verification. Please use the following verification code to proceed:</p>
          
          <!-- Verification Code Table -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; text-align: center; background-color: #4CAF50; color: white; font-size: 24px; font-weight: bold; border-radius: 5px;">
                ${verificationCode}
              </td>
            </tr>
          </table>
          
          <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 16px; color: #555;">Thanks,</p>
          <p style="font-size: 16px; color: #555;">Your Team</p>
        </div>
      </body>
    </html>
  `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send verification email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "Verification email sent. Please enter the code to proceed.",
            success: true,
          });
        }
      });
    } else {
      // If no record found, create a new temp user record and send the email
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newTempUser = new TempUserModel({
        email,
        verificationCode,
      });

      await newTempUser.save(); // Save temporarily for email verification

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
        html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">Hi,</p>
          <p style="font-size: 16px; color: #555;">You requested a email verification. Please use the following verification code to proceed:</p>
          
          <!-- Verification Code Table -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; text-align: center; background-color: #4CAF50; color: white; font-size: 24px; font-weight: bold; border-radius: 5px;">
                ${verificationCode}
              </td>
            </tr>
          </table>
          
          <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 16px; color: #555;">Thanks,</p>
          <p style="font-size: 16px; color: #555;">Your Team</p>
        </div>
      </body>
    </html>
  `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send verification email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "Verification email sent. Please enter the code to proceed.",
            success: true,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error in verifyEmail", error: err.message, success: false });
  }
};


  
exports.verifyCode = async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
  
      const tempUser = await TempUserModel.findOne({ email });
  
      if (!tempUser) {
        return res.status(404).json({ message: "No pending verification for this email." });
      }
  
      if (tempUser.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
  
      // If email is verified, return success and prompt for further details
      return res.status(200).json({
        message: "Email verified successfully! Please provide the rest of the information to complete registration.",
        success: true,
        email: tempUser.email, // Send email to frontend to pre-fill it
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };



   
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    let existingUser= await serviceModel.findOne({email});
  
    if(!existingUser){
      return res.status(404).json({ message: "Email not found" });
    }
      
    // Check if a pending email verification exists
    let tempUser = await TempUserModel.findOne({ email });
    if (tempUser) {
      // Generate a new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      tempUser.verificationCode = verificationCode;
      await tempUser.save(); // Update the verification code

      // Send the email again with the new verification code
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Forgot Password",
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #555;">Hi,</p>
                <p style="font-size: 16px; color: #555;">You requested a password reset. Please use the following verification code to proceed:</p>
                
                <!-- Verification Code Table -->
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                  <tr>
                    <td style="padding: 10px; text-align: center; background-color: #4CAF50; color: white; font-size: 24px; font-weight: bold; border-radius: 5px;">
                      ${verificationCode}
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                <p style="font-size: 16px; color: #555;">Thanks,</p>
                <p style="font-size: 16px; color: #555;">Your Team</p>
              </div>
            </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send verification email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "Verification email sent. Please enter the code to proceed.",
            success: true,
          });
        }
      });
    } else {
      // If no record found, create a new temp user record and send the email
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newTempUser = new TempUserModel({
        email,
        verificationCode,
      });

      await newTempUser.save(); // Save temporarily for email verification

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Forgot Password",
        html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">Hi,</p>
              <p style="font-size: 16px; color: #555;">You requested a password reset. Please use the following verification code to proceed:</p>
              
              <!-- Verification Code Table -->
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px; text-align: center; background-color: #4CAF50; color: white; font-size: 24px; font-weight: bold; border-radius: 5px;">
                    ${verificationCode}
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
              <p style="font-size: 16px; color: #555;">Thanks,</p>
              <p style="font-size: 16px; color: #555;">Your Team</p>
            </div>
          </body>
        </html>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send verification email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "Verification email sent. Please enter the code to proceed.",
            success: true,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error in forgot password", error: err.message, success: false });
  }
};



  exports.verifyForgotCode= async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
  

      // Validate input
    if (!email || !verificationCode) {
        return res.status(400).json({ message: "Please provide both email and verification code." });
      }
      
      const tempUser = await TempUserModel.findOne({ email });
  
      if (!tempUser) {
        return res.status(404).json({ message: "No pending verification for this email." });
      }
  
      if (tempUser.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
  
      // If email is verified, return success and prompt for further details
      return res.status(200).json({
        message: "Email verified successfully! Please provide the rest of the information to complete registration.",
        success: true,
        email: tempUser.email, // Send email to frontend to pre-fill it
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  

  exports.changePassword=async(req,res,next)=>{
    try{    
        const {email,password} =req.body;
    
        const salt= await bcrypt.genSalt(10);

        const newPassword= await bcrypt.hash(password,salt);

        const updateUser= await serviceModel.findOneAndUpdate(
            {email:email},
            {password:newPassword},
            {new:true}
        )
        res.status(200).json({message:"Password changed successfully", success:true});

    }catch(err){
        res.status(500).json({ message: "Error in changePassword", error: err.message, success:false});
    }
  }

  exports.editAbout= async(req,res)=>{
    try{
      const {id}=req.params;
      const {about}= req.body;

      if(!id || !about){
        res.status(400).json({message:"Provide All Credentials", success:false})
      };

      const user= await serviceModel.findById(id);

      if(!user){
        res.status(404).json({message:"User Not Found", success:false})
      }

      try{
        user.about = about;
        await user.save();
        res.status(200).json({ message: "About updated successfully", success: true, user });

      }catch(err){
        res.status(500).json({message:"Server Error", error:err.message, success:false})
      }

    }catch(err){
      res.status(500).json({ message: "Error in edit about", error: err.message, success:false});
    }
  }
  

  exports.editProfile = async (req, res) => {
    try {
    
      const id = req.user._id;
      console.log(req.user._id);
      let { phone} = req.body;

      let address= req.body.address;

      try{
        address= JSON.parse(address);
      }catch(err){
        console.log("Address Error",err)
      }

      try{
          phone= JSON.parse(phone);
      }catch(err){
        console.log(err);
      }
      let imgUrl="";
  
      console.log("Address Received",address);
      // Check if image1 is uploaded correctly
      const image = req.file;
      if (image) {
       console.log("Received image:", image);
       
                   // Await the image upload to Cloudinary
                   const uploadImg = await cloudinary.uploader.upload(image.path);
                   console.log("Cloudinary Response:", uploadImg);
                   imgUrl= uploadImg.secure_url;
      }
  
      // Find user by ID
      const checkUser = await serviceModel.findById(id);
      if (!checkUser) {
        return res.status(404).json({ message: "User Not Found", success: false });
      }

  
      // Prepare update data
      const updateData = {
        phone: phone ,  // Only update if provided
        address: address ? address :checkUser.address ,  // Only update if provided
        image: imgUrl  || checkUser.image  // New image URL
      };
  
      // Update the user
      const updatedUser = await serviceModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user", success: false });
      }
  
      // Return the updated user data
      return res.status(200).json({ message: "Profile updated successfully", data: updatedUser, success: true });
      
    } catch (err) {
      console.error("Error in editProfile:", err.message);
      return res.status(500).json({ message: "Error in editing profile", error: err.message, success: false });
    }
  };
  