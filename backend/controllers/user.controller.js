const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const cloudinary=require('../config/cloudinary');

const nodemailer= require('nodemailer');
const TempUserModel = require('../models/TempUser.model');
const bcrypt= require('bcrypt');



const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
})
const signToken=(id)=>{
    try{
        return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
    }catch(err){
        console.log(err);
    }
}

exports.addUser=async(req,res,next)=>{
    try{
        const {name,middleName, lastName,email,password,address,gender,phone}=req.body;

        if(!name || !email|| !password || !address || !gender || !phone ||!address){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }

    
    

        const newUser=new TempUserModel({
            name,
            middleName,
            lastName,
            email,
            password,
            address,
            gender,
            phone,
           address
        })

        try{
            await newUser.save();
            res.status(200).json({
                message:"User added successfully",
                success:true
            })
        }catch(err){
            res.status(400).json({
                message:"Failed to add user",
                error:err.message
            })
        }

    }catch(err){
        res.status(500).json({
            message:"Error in addUser",
            err:err.message,
            success:false
        })
    }
}


exports.Login=async (req,res) => {
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Please fill all the fields",
                success:false
            })
        }

        const user=await userModel.findOne({email});

        if(!user || !(await user.comparePassword((password)))){
            return res.status(400).json({
                message:"Invalid email or password",
                success:false
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
        res.status(400).json({
            error:err.message,
            message:"error in Login",
            success:false
        })
    }
}


exports.logout=async (req,res) => {
    try{
        res.clearCookie('jwt');
        res.status(200).json({success:true, message:"Logged out successfully"});
    }catch(err){
        res.status(400).json({
            message:"Error in logout"
        })
    }
};
exports.updateData = async (req, res, next) => {
    try {
        const { name,about,address,email } = req.body;
        const image=req.file;
        let   imgUrl="";
        if (image) {
            // Log the received image to check if it's correct
            console.log("Received image:", image);

            // Await the image upload to Cloudinary
            const uploadImg = await cloudinary.uploader.upload(image.path);
            console.log("Cloudinary Response:", uploadImg);
            imgUrl= uploadImg.secure_url;
        }
        const data={name,about,address,email,image:imgUrl};
        const updateUser = await userModel.findByIdAndUpdate(req.user.id, data, { new: true });

        if (!updateUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: updateUser
        });

    } catch (error) {
        console.error(error);

        // Additional logging for better debugging
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.addEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Please provide an email" });
      }

      let existingUser= await userModel.findOne({email});
    
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
          html:`
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
          text: `Your verification code is: ${verificationCode}`,
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
      res.status(500).json({ message: "Error in addEmail", error: err.message, success: false });
    }
  };
  
exports.verifyEmail = async (req, res) => {
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

      let existingUser= await userModel.findOne({email});
    
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
      res.status(500).json({ message: "Error in addEmail", error: err.message, success: false });
    }
  };
  

  exports.verifyEmailPassword = async (req, res) => {
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

        const updateUser= await userModel.findOneAndUpdate(
            {email:email},
            {password:newPassword},
            {new:true}
        )
        res.status(200).json({message:"Password changed successfully", success:true});

    }catch(err){
        res.status(500).json({ message: "Error in changePassword", error: err.message, success:false});
    }
  }