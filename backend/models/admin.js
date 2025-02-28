const mongoose =require("mongoose");
const bcrypt= require('bcrypt');
const adminSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String, default:"Admin"}
    
})


adminSchema.pre("save",async function(){
    if(!this.isModified('password')){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})


adminSchema.methods.comparePassword=async function (password) {
    return await bcrypt.compare(password,this.password);
    
}
const adminModel= mongoose.model("Admin",adminSchema);



module.exports=adminModel;