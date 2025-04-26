const mongoose =require('mongoose');


const appointmentSchema= new mongoose.Schema({
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ServiceProvider",
        required:true
    },
    slot:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customers",
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","rejected","accepted","canceled"],
        default:"pending"
    },
    userName: {
       type:String
      },
    fees:{
        type:Number
      },

      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },img:{
        type:"String"
    },
    number:{
        type:Number
    },
    serviceProviderImage:{
        type:"String"
    }
      
},
{timestamps:true});

const appointmentModel= mongoose.model("Appointment",appointmentSchema);
module.exports=appointmentModel;