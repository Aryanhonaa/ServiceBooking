const mongoose=require('mongoose');
require('dotenv').config();

const dbConnect= async()=>{
    try{
        const con= await mongoose.connect(process.env.DB);
        console.log(
            "Database connected: ",
            `Host: ${con.connection.host}`,
            `Database: ${con.connection.name}`
            
        )
    }catch(err){
        console.log("Cannot connect to the Database",err);
        
    }
}

module.exports=dbConnect;