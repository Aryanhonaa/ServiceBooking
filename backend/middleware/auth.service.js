const jwt=require('jsonwebtoken');
const service=require('../models/serviceProvider.model')
require('dotenv').config();

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;

        if(!token){
            return res.status(400).send({
                success:false,
                message:"Not authorized- No token provided"
            })
        }

        const decode=jwt.verify(token,process.env.JWT_SECRET);
        
        if(!decode){
            return res.status(400).send({
                success:false,
                message:"Not authorized - Invalid token"
            })
        }

        const currentUser=await service.findById(decode.id);

        req.user=currentUser;

        res.status(200).json({
            success:true
        })
    }catch(err){
        res.status(500).json({message:err.message,
            error:'Error in protect route'
        })
    }
}