const mongoose=require('mongoose');
const validate=require('validator');
const bcrypt=require('bcrypt');

const providerSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    middleName:{
        type:String
    },
    lastName:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (v) => /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/.test(v),
          message: props => `${props.value} is not a valid email!`
        }
      },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
    },
    speciality:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        
    },
    about:{
        type:String,
        // required:true,
    },
    available:{
        type:Boolean,
        // required:true
    },
    phone:[{
        type:String,
        required:true,
        unique:true
    }],
    fees:{
        type:Number,
        
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
    },
    role:{
        type:String,
        default:"ServiceProvider"
    },
    certified:{
        type:Boolean,
        default:false
    },
    serviceImg:{
        type:String,
    },
    serviceDes:{

    },
    tags:{
        type:Array,
    },
    pricing:{
        type:Object,
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