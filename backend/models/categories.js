const mongoose=require('mongoose');
const { trim } = require('validator');


const categoriesSchema= new mongoose.Schema({
    name:{type:String,required:true},
    img:{type:String, required:true},
    speciality:[
        {
        specialityName:{type:String, required:true},
        img:{type:String},
        detail:[{type:String, trim:true}]
        }
    ]
},{timestamps:true})



const categoriesModel=mongoose.model("Categories", categoriesSchema);
module.exports=categoriesModel;