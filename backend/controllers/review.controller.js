const reviewModel= require('../models/review.model');


exports.addReview=async(req,res)=>{
    try{
 
        const {serviceProvider, user, rating, comment, userEmail,appointment, userName}=req.body;

        if (
            !serviceProvider ||
            !user ||
            !appointment ||
            !userEmail ||
            !userName ||
            !rating ||
            rating.quality == null ||
            rating.price == null ||
            rating.service == null
          ) {
            return res.status(400).json({msg:"Please fill in all fields"});
        }

       
        console.log("ServiceP",serviceProvider);
        console.log("User",user);
        console.log("Rating",rating);
        console.log("Comment",comment);
        console.log("UserEmail",userEmail);
        console.log("Appointment",appointment);
        console.log("UserName",userName);
        const checkReview= await reviewModel.findOne({
            serviceProvider:serviceProvider, 
            user:user, 
            appointment:appointment
        })

        if(checkReview){
            return res.status(300).json({msg:"You have already reviewed this service provider"});
        }
        const newRating= new reviewModel(
            {
                serviceProvider:serviceProvider,
                user:user,
                rating:rating,
                comment: comment,
                userEmail: userEmail,
                appointment: appointment,
                userName: userName
            }
        )

        try{
            await newRating.save();
            res.status(200).json({success:true, message:"Review Saved SuccessFully"});
        }catch(err){
            console.log(err);
            return res.status(400).json({msg:err.message, message:"Cannot Save REview"});
          
        }

      
            
        
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error in addreview", error:err.message})
    }
}



exports.showRatings=async(req,res)=>{
    try{
        const {serviceProvider}=req.query;
        console.log("PRvo",serviceProvider);
        if(!serviceProvider){
            return res.status(400).json({message:"Send serviceProvider id"});
        }

        const getReviews=await reviewModel.find({serviceProvider:serviceProvider});

        if(getReviews.length ===0){
            return res.status(300).json({message:"No Reviews Found"});
        }

        res.status(200).json({data:getReviews, success:true});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error in showRatings", error:err.message});
    }
}