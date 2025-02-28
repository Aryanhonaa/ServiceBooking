const mongoose=require('mongoose');


const categoriesSchema= new mongoose.Schema({
    name:{type:String,required:true},
    img:{type:String, required:true},
    speciality:[
        {
        specialityName:{type:String, required:true},
        img:{type:String},
        }
    ]
},{timestamps:true})



const categoriesModel=mongoose.model("Categories", categoriesSchema);
module.exports=categoriesModel;