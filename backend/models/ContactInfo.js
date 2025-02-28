const mongoose =require('mongoose');


const contactSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    number:{
        type:String
    },
    message:{
        type:String
    }
})

const contactModel= mongoose.model("ContactInfo",contactSchema);
module.exports=contactModel;