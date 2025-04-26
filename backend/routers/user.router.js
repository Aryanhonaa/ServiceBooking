const router=require('express').Router();
const userController=require('../controllers/user.controller');
const protectRoute=require('../middleware/user.protectRoute');
const appointmentController=require('../controllers/appointment.controller');
const reviewController= require('../controllers/review.controller');
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



router.get('/service/providers/:specialityName',userController.showUser);
router.get('/service/profile/:id',userController.profileProvider);


router.post('/send-appointment',upload.single('image'),appointmentController.sendAppointment);
router.post('/send-speciality-img',userController.sendSpecialityImg);



router.post('/send-review', reviewController.addReview);
router.get('/get-bookings',appointmentController.sendBookings);


router.get('/get-booking-detail',userController.bookingDetails);
router.get('/get-provider-details',userController.sendProviderDetails);


router.post('/send-reviews', reviewController.addReview);
router.get('/get-reviews',reviewController.showRatings);


router.post('/cancel-appointment',appointmentController.finalStatus);


module.exports=router;