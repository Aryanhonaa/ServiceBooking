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
const adminRouter=require('./routers/admin.router');

//middlewares
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/api/serviceprovider',serviceProvRoutes);
app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);
//api endpoints
app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.listen(port, ()=>{
    console.log(`Server running at port: ${port}`);
    db();
    // connectCloudinary();
})
