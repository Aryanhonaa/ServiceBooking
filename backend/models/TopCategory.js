const mongoose= require('mongoose');


const topCategorySchema= new mongoose.Schema({
    name:{type: String, require:true},
    img:{type:String, require:true}
},{timestamps:true})

const topCategoryModel= mongoose.model("TopCategory",topCategorySchema);
module.exports=topCategoryModel;