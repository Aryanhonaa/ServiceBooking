const mongoose = require('mongoose');
const bcrypt =require('bcrypt');


const TempServiceSchema= new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    category:String,
    speciality: String,
    experience: Number,
    phone: {type:String, unique:true},
    about: String,
    fees: Number,
    address: Object,
    date: { type: Date, default: Date.now },
    image: String,
    citizenF: String,
    citizenB: String,
    validation:{type:String, default:"Pending"}
})


const TempServiceModel= mongoose.model("TempService",TempServiceSchema);

module.exports=TempServiceModel;