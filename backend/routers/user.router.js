const router=require('express').Router();
const userController=require('../controllers/user.controller');
const protectRoute=require('../middleware/user.protectRoute');
const upload=require('../middleware/multer');

router.post('/addUser',userController.addUser);
router.post('/loginUser',userController.Login);
router.post('/logout',userController.logout);
router.get('/me',protectRoute,(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
})
router.patch('/updateData', protectRoute, upload.single('image'), userController.updateData);
router.post('/add-email',userController.addEmail);
router.post('/verify-email',userController.verifyEmail);


router.post('/forgot-password',userController.forgotPassword);
router.post('/verify-forgot',userController.verifyEmailPassword);
router.patch('/change-password',userController.changePassword);



module.exports=router;