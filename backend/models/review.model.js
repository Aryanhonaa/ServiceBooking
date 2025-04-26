const mongoose =require ('mongoose');


const reviewSchema= new mongoose.Schema({
    serviceProvider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ServiceProvider",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customers",
        required:true
    },
    rating:{
       quality:{type:Number, required: true, min:1, max:5},
       price:{type:Number, required: true, min:1, max:5},
       service:{type:Number, required: true, min:1, max:5},
    },
    overallScore:{
        type:Number,
      
    },
    comment:{
        type:String,
        trim:true
    },
    userEmail:{
        type:String,
        required:true,
        trim:true
    },
    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },
    userName:{
        firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String }
       
    }

}, {timestamps:true});

reviewSchema.pre("save", function(next) {
    if (this.rating) {
      const { quality, price, service } = this.rating;
      this.overallScore = (quality + price + service) / 3;
    }
    next();
  });


const reviewModel=mongoose.model("Review",reviewSchema);
module.exports=reviewModel;