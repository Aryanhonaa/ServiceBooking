const mongoose=require('mongoose');
const validate=require('validator');
const bcrypt=require('bcrypt');

const providerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validator:validate.isEmail,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    speciality:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    },
    available:{
        type:Boolean,
        // required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    fees:{
        type:Number,
        required:true
    },
    address:{
        type:Object, 
        required:true
    },
    date:{
        type:Number,
        required:true
    },
    slots_booked:{
        type:Object,
        default:{}
    },
    citizenF:{
        type:String,
        required:true
    },
    citizenB:{
        type:String,
        required:true
    }
},{minimize:false, timestamps:true})


providerSchema.pre('save',async function(next) {


    if(!this.isModified('password')){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})


providerSchema.methods.comparePassword=async function (password) {
    return await bcrypt.compare(password,this.password);
    
}
const serviceModel= mongoose.model('ServiceProvider', providerSchema)
module.exports=serviceModel;