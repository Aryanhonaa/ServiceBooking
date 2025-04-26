const express=require('express');
const router=express.Router();
const upload=require('../middleware/multer');
const serviceController=require('../controllers/service.controller');
const { protectRoute } = require('../middleware/auth.service');
// const protectRoute=require('../middleware/auth.service');
const timeTableController= require('../controllers/timeTable.controller');
const appointmentController= require('../controllers/appointment.controller');
const reviewController= require('./../controllers/review.controller');


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


router.post('/set-time-table',timeTableController.setAvailability);
router.get('/get-time-table',timeTableController.getAvailability);


router.get('/get-appointments', appointmentController.getAppointments);
router.get('/get-user-data',serviceController.sendUserData);

router.get('/get-history/:userId/:serviceProviderId',appointmentController.historyAppointments);
router.get('/get-accepted-appointment',appointmentController.sendAcceptedAppointment);

router.post('/reject-appointment',appointmentController.statusAppointment);
router.get('/get-accepted-appointment-details',appointmentController.sendAppointmentDetails);

router.post('/post-status',appointmentController.finalStatus);

router.get('/get-completed-appointment',appointmentController.getCompletedAppointments);
router.get('/history-appointment',serviceController.historyAppointment);

router.get('/get-reviews', reviewController.showRatings);

router.post('/certify-serviceProvider',upload.single('image'),serviceController.ceritfyService)

router.post('/update-price',serviceController.updatePrice);
module.exports=router;