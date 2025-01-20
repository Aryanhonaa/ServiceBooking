const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const cookieParser=require('cookie-parser')
// const connectCloudinary=require('./config/cloudinary')
require('dotenv').config();

//app config
const app=express();
const port=process.env.PORT || 8000;
const db=require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const serviceProvRoutes=require('./routers/serviceP.router');
const userRouter=require('./routers/user.router');

//middlewares
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/serviceprovider',serviceProvRoutes);
app.use('/api/users',userRouter);
//api endpoints
app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.listen(port, ()=>{
    console.log(`Server running at port: ${port}`);
    db();
    // connectCloudinary();
})
