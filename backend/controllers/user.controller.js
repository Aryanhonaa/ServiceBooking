const userModel=require('../models/serviceProvider.model');


exports.addUser=async(req,res,next)=>{
    try{
        const {name,email,password,about,address,gender,phone}=req.body;

        if(!name || !email|| !password || !about|| !address || !gender || !phone){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const USer=await userModel.findOne({email});
        if(email){
            return res.status(400).json({
                message:"User already exists"
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