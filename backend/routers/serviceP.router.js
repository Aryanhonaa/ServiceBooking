const express=require('express');
const router=express.Router();
const upload=require('../middleware/multer');
const serviceController=require('../controllers/service.controller');
const { protectRoute } = require('../middleware/auth.service');
// const protectRoute=require('../middleware/auth.service');


router.post('/add-prov',upload.fields([
    {name:'image1', maxCount:1},
    {name:'image2', maxCount:1},
    {name:'image3', maxCount:1},
]),
serviceController.addProvider);

router.post('/login-service',serviceController.login);
router.get('/me',protectRoute,(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })

})
router.post('/verify-email',serviceController.verifyEmail);
router.post('/verify-code',serviceController.verifyCode);
router.post('/forgot-password',serviceController.forgotPassword);
router.post('/verify-forgotCode',serviceController.verifyForgotCode);
router.patch('/change-password',serviceController.changePassword);

router.put('/update-about/:id',serviceController.editAbout);
router.patch('/update-profile',protectRoute,upload.single('image'),serviceController.editProfile);
module.exports=router;