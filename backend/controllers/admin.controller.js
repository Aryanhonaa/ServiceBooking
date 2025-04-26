const categoriesModel = require('../models/categories');
const cloudinary = require('../config/cloudinary');
const path=require('path');
const contactModel=require('../models/ContactInfo');
const userModel = require('../models/user.model');
const serviceModel = require('../models/serviceProvider.model');
const adminModel = require('../models/admin');
const jwt= require('jsonwebtoken');
const TempServiceModel = require('../models/tempService.modal');
const nodemailer= require('nodemailer');
const topCategoryModel = require('../models/TopCategory');
require('dotenv').config();

exports.signUp= async(req,res)=>{
  try{
    const {email,password, phoneNumber}=req.body;

    if(!email || !password || !phoneNumber ){
      return res.status(400).json({message:"Provide All Credential", success:false});
    }


    const newAdmin= new adminModel({
      email,
      password,
      phoneNumber
    })

    try{
      await newAdmin.save();
      res.status(201).json({message:"Admin Created Successfully", success:true});
    }catch(err){
      res.status(400).json({message:"Failed to Create Admin", success:false});
    }
  }catch(err){
    res.status(500).json({
      error:err.message,
      success:false
    }
    )
  }
}
exports.addCategories = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request File:", req.files);

  try {
    const { name,specialityName } = req.body;

    if (!name ||!specialityName ||!req.files) {
      return res.status(400).json({ message: "All values should be provided (name and categoryImage)!", success: false });
    }

    if (!req.files || !req.files['categoryImage'] || !req.files['specialityImg']) {
      return res.status(400).json({ message: "Images are required!", success: false });
    }
    const category =await categoriesModel.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (category) {
      return res.status(400).json({ message: "This category already exists!", success: false });
    }

    
    let imageUrl;
    try {
      const imageUpload = await cloudinary.uploader.upload(req.files['categoryImage'][0].path, { resource_type: 'image' });
      imageUrl = imageUpload.secure_url;
      console.log("Image Uploaded to Cloudinary:", imageUrl);
    } catch (error) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary", success: false, error: error.message });
    }

    let specialityImgUrl;
    try{
      const specalityImageUpload=await cloudinary.uploader.upload(req.files['specialityImg'][0].path,{resource_type:'image'});
      specialityImgUrl=specalityImageUpload.secure_url;
      console.log("Speciality Image Uploaded to Cloudinary:", specialityImgUrl);
    }catch(err){
      return res.status(500).json({ message: "Error uploading speciality image to Cloudinary", success: false, error: err.message });
    }

    
    const newCategory = new categoriesModel({
      name,
      img: imageUrl,
      speciality: [{
        specialityName: specialityName,
        img: specialityImgUrl  // Ensure this is set properly
      }]
    });

    try {
      await newCategory.save();
      res.status(200).json({ message: "Category added successfully!", success: true });
    } catch (err) {
      res.status(400).json({ message: "Error saving category", success: false, err: err.message });
    }
  } catch (err) {
    console.error('Error details:', err);  // This will help trace the error
    res.status(500).json({ message: "Error in addCategories", success: false, error: err.message });
  }
};

exports.addSpecialityToCategory = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.file);

  try {
    const categoryId=req.params.id;
    const { specialityName, detail } = req.body;

    // Validate that category ID, speciality name, and speciality image are provided
    if (!categoryId || !specialityName || !req.file) {
      return res.status(400).json({ message: "All values should be provided (categoryId, specialityName, and specialityImage)!", success: false });
    }

    // Check if the category exists
    const category = await categoriesModel.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found!", success: false });
    }


    const checkSpeciality= category.speciality.some(speciality => speciality.specialityName === specialityName);
    if(checkSpeciality){
      return res.status(400).json({message:"Speciality already exists!!", success:false})
    }
    // Upload speciality image to Cloudinary
    let specialityImageUrl;
    try {
      const specialityImageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      specialityImageUrl = specialityImageUpload.secure_url;
      console.log("Speciality Image Uploaded to Cloudinary:", specialityImageUrl);
    } catch (error) {
      return res.status(500).json({ message: "Error uploading speciality image to Cloudinary", success: false, error: error.message });
    }

    // Create a speciality object to add to the category
    const speciality = {
      specialityName: specialityName,
      img: specialityImageUrl,  // Save speciality image URL
      detail:detail
    };

    // Add the new speciality to the category's speciality array
    category.speciality.push(speciality);

    // Save the updated category
    await category.save();
    res.status(200).json({ message: "Speciality added to category successfully!", success: true });

  } catch (err) {
    res.status(500).json({ message: "Error in addSpecialityToCategory", success: false, error: err.message });
  }
};


exports.removeSpeciality=async(req,res)=>{
  try{
    const {categoryId,specialtyId}= req.params;
    // const {}= req.body;

    console.log("CATID",categoryId)
    console.log("SPEID",specialtyId)
    if(!categoryId || !specialtyId){
      return res.status(400).json({message:"Send all requirements", success:false });
    }

    const existCategory= await categoriesModel.findById(categoryId);

    if(!existCategory){
      return res.status(400).json({ message: "Category not found!", success: false });
    }

    const specialityIndex= existCategory.speciality.findIndex(speciality=> speciality._id.toString() === specialtyId);


    if (specialityIndex === -1) {
      return res.status(400).json({ message: "Speciality not found in this category!", success: false });
    }

    // Remove the speciality from the array
    existCategory.speciality.splice(specialityIndex, 1);  // Removes the speciality at that index

    // Save the updated category
    await existCategory.save();
    return res.status(200).json({ message: "Speciality removed successfully!", success: true });
  }catch(err){
    res.status(500).json({message:"Error in removeSpeciality", success:false, err:err.message})
  }
}
exports.getCategory=async (req,res) => {
    try{
        const categories=await categoriesModel.find();

       
        res.status(200).json({
            message:"Categories retrived successfully",
            categories,
            success:true
           

        })
    }catch(err){
        res.status(500).json({
            message:"Error in getCategory",
            error:err.message
        })
    }
    
}

exports.getSpecialities= async(req,res,next)=>{
  try{
    const {categoryName}=req.params;
    console.log("CATE",categoryName)
    const category = await categoriesModel.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') } // case-insensitive match
    });
    
  
  if(!category){
  return res.status(404).json({message:"Category not found",success:false});
  }
  
  const speciality=category.speciality;
  res.status(200).json({data:speciality, success:true});

  }catch(err){
    res.status(500).json({
      message:"Error in getSpecialities",
      error:err.message
    })
  }
};

exports.getTempService=async(req,res)=>{
  try{
    const tempServices= await TempServiceModel.find();
    res.status(200).json({
      success:true,
      data:tempServices
    });
  }catch(err){
    res.status(500).json({ message: "Error in getTempService",
      error: err.message,
      success: false,})
  }
};


exports.getTempServiceData=async(req,res)=>{
  try{
    const {id} =req.params;

    const tempService=await TempServiceModel.findById(id);
    if(!tempService){
      return res.status(404).json({message:"Temp Service not found",success:false});
    }

    res.status(200).json({
      success:true,
      data:tempService
    })

  }catch(err){
    res.status(500).json({ message: "Error in getTempServiceData",error:err.message})
  }
}


exports.contactInfo=async(req,res)=>{
  try{
    const {name, email, number, message}=req.body;

    if(!name || !email || !message){
      return res.status(400).json({message:"Please fill all Necessary fields",success:false});
    }

    const newContact= new contactModel({
      name,
      email,
      number,
      message
    });

    await newContact.save();
    res.status(200).json({message:"Contact Info saved successfully",success:true});
  }catch(err){
    res.status(500).json({message:"Error in contactInfo",error:err.message})
  }
}

exports.sendContact=async(req,res)=>{
  try{
    const contact= await contactModel.find();

    res.status(200).json({
      success:true,
      data:contact
    })
  }catch(err){
    res.status(500).json({message:"Error in sendContact",error:err.message})
  }
}

exports.deleteContact=async(req,res)=>{
  try{
    const {id}=req.params;

    if(!id){
      return res.status(400).json({message:"Please provide id",success:false});
    }

    const contact=await contactModel.findById(id);
    if(!contact){
      return res.status(404).json({message:"Contact not found",success:false});
    }

    try{
       await contactModel.findByIdAndDelete(id);
      res.status(200).json({message:"Contact deleted successfully",success:true});
    }catch(err){
      res.status(500).json({message:"Error in deleteContact",error:err.message, success:false})
    }
  }catch(err){
    res.status(500).json({message:"Error in deleteContact",error:err.message, success:false})
  }

}

const signToken=(id)=>{
    try{
        return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
    }catch(err){
        console.log(err);
    }
}

exports.login=async(req,res)=>{
  try{
    const {email ,password}=req.body;

    if(!email || !password){
      return res.status(400).json({message:"Please fill all Necessary fields",success:false});
    }

    let user = await serviceModel.findOne({ email });
    if (user) {
      const checkLogin = await user.comparePassword(password);
      if (checkLogin) {
        const token = signToken(user._id);

        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
          success: true,
          user,
          token,
        });
      }
    }
    

    user = await adminModel.findOne({ email });
    if (user) {
      const checkLogin = await user.comparePassword(password);
      if (checkLogin) {
        const token = signToken(user._id);

        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
          success: true,
          user,
          token,
        });
      }
    }

    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
    });

   

  }catch(err){
    res.status(500).json({message:"Error in login",error:err.message})
  }
}



const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
})

exports.addVerifiedService=async(req,res)=>{
  try{
   const {id}=req.params;


   const tempService= await TempServiceModel.findById(id);

   if(!tempService){
    return res.status(400).json({message:"The user doesnot exits", success:false})
   }

   const serviceData= await serviceModel.findOne({emaill:tempService.email});

   if(serviceData){
    return res.status(400).json({message:"User already exists", success:false});
   }

   const newService= new serviceModel({
    firstName: tempService.firstName,
    middleName: tempService.middleName,
    lastName: tempService.lastName,
    email: tempService.email.toLowerCase(),
    password: tempService.password, 
    category:tempService.category,
    speciality: tempService.speciality,
  
    phone: tempService.phone,
    about: tempService.about,
   
    address: tempService.address,
    date: Date.now(),
    image: tempService.image,
    citizenF: tempService.citizenF,
    citizenB: tempService.citizenB,
   })

   try{
    await newService.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: tempService.email,
      subject: "Service Provider Verification",
      html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
            <h2 style="color: #333;">Service Provider Verified</h2>
            <p style="font-size: 16px; color: #555;">Dear ${tempService.firstName},</p>
            <p style="font-size: 16px; color: #555;">Congratulations! Your service provider account has been successfully verified.</p>
            <p style="font-size: 16px; color: #555;">You can now log in and start offering your services.</p>
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
      } else {
        console.log("Email sent:", info.response);
      }
    });

    await TempServiceModel.findByIdAndDelete(id);

    res.status(200).json({message:"Service Provider Verified Successfully",success:true})

   }catch(err){
    res.status(500).json({
      message:"Cannot Verify Service Provider",
      success:false
    })
   }


  }catch(err){
    res.status(500).json({
      success:false,
      error:"Error in addVerifiedService",
      message:err.message
    })
  }
}



exports.rejectServiceProvider=async(req,res)=>{
  try{
    const {id}= req.params;

    const {reason}= req.body;

    const tempService= await TempServiceModel.findById(id);

    const mailOptions = {
      from: process.env.EMAIL,
      to: tempService.email,
      subject: "Service Provider Verification",
      html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
            <h2 style="color: #d9534f;">Service Provider Verification Failed</h2>
            <p style="font-size: 16px; color: #555;">Dear ${tempService.firstName},</p>
            <p style="font-size: 16px; color: #555;">We regret to inform you that your service provider account verification was unsuccessful.</p>
            <p style="font-size: 16px; color: #FF0000;">Reason: ${reason}.</p>
            <p style="font-size: 16px; color: #555;">Please check your submitted details and try again.</p>
            <p style="font-size: 16px; color: #555;">For further assistance, contact our support team.</p>
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
      } else {
        console.log("Email sent:", info.response);
      }
    });

    try{
      await TempServiceModel.findByIdAndDelete(id);

      res.status(200).json({ message: "Service provider rejected and removed", success: true });
    } catch (deleteError) {
      console.error("Error deleting service provider:", deleteError.message);
      res.status(400).json({ message: "Failed to remove the service provider", success: false, error: deleteError.message });
    }

  }catch(err){
    res.status(500).json({message:"Error in reject ServiceProvider", error:err.message});
  }
}
exports.topCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category name already exists
    const checkName = await topCategoryModel.findOne({ name });
    if (checkName) {
      return res.status(400).json({ message: "Category already exists", success: false });
    }

    // Check if an image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image", success: false });
    }

    let imageUrl;
    
    // Upload image to Cloudinary
    try {
      const imgs = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      imageUrl = imgs.secure_url;
      console.log("Category Image Uploaded to Cloudinary:", imageUrl);
    } catch (err) {
      console.error("Error uploading image to Cloudinary:", err.message);
      return res.status(500).json({ message: "Image upload failed", success: false });
    }

    // Create new category
    const newCategory = new topCategoryModel({
      name,
      img: imageUrl // Ensure this matches the MongoDB model
    });

    try {
      await newCategory.save();
      return res.status(201).json({ message: "Category created successfully", success: true });
    } catch (err) {
      console.error("Error saving new category:", err.message);
      return res.status(500).json({ message: "Error saving category", success: false });
    }

  } catch (err) {
    console.error("Error in topCategory:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.sendTopCategory=async(req,res)=>{
  try{
    const data= await topCategoryModel.find();


    res.status(200).json({
      success:true,
      data
    })

  }catch(err){
    res.status(500).json({message:"Error in sendTopCategory", error:err.message, sucess:false})
  }
}


exports.getAllUsers=async(req,res)=>{
  try{
    const getUsers= await userModel.find();

    res.status(200).json({data:getUsers, success:true});
  }catch(err){
    res.status(500).json({message:"Error in getAllUsers", error:err.message,})
  }
}

exports.getAllProviders=async(req,res)=>{
  try{
    const getProvider= await serviceModel.find();
    res.status(200).json({data:getProvider, success:true});

  }catch(err){
    res.status(500).json({message:"Error in getAllProviders", error:err.message})
  }
}

exports.getCategory=async(req,res)=>{
  try{

    const getCategory= await categoriesModel.find();
    res.status(200).json({data: getCategory, success: true});
  }catch(err){
    res.status(500).json({message:"Error in getCategory", error:err.message});
  }
}
exports.deleteUser=async(req,res)=>{
  try{
    const {id}=req.query;

    if(!id){
      return res.status(400).json({message: "User ID is required", success: false});
    }

    const getUser= await userModel.findByIdAndDelete(id);

  res.status(200).json({message:"User Deleted Successfully", success:true});
  }catch(err){
    res.status(500).json({message:"Error in deleteUser", error: err.message});
  }
}

exports.deleteServiceProvider=async(req,res)=>{
  try{
    const {id}=req.query;

    if(!id){
      return res.status(400).json({message: "User ID is required", success: false});
    }

    const getServiceProvider= await serviceModel.findByIdAndDelete(id);

  res.status(200).json({message:"User Deleted Successfully", success:true});
  }catch(err){
    res.status(500).json({message:"Error in deleteUser", error: err.message});
  }
}

exports.getServiceProviderDetail=async(req,res)=>{
  try{
    const {id}=req.query;

    if(!id){
      return res.status(400).json({message: "Service Provider ID is required", success: false});
    }
    const serviceProvider = await serviceModel.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service Provider not found", success: false });
    }
    res.status(200).json({ data: serviceProvider, success: true });

  }catch(err){
    res.status(500).json({message:"Error in getServiceProviderDetail", error: err.message});
  }
}