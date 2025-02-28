const router=require('express').Router();
const categoriesController=require('../controllers/admin.controller');
const protectRoute=require('../middleware/user.protectRoute');
const upload=require('../middleware/multer');



router.post('/createAdmin',categoriesController.signUp);
router.post('/addCategory',upload.fields([
   {name: 'categoryImage',maxCount:1},
   {name: 'specialityImg',maxCount:1}
])
,categoriesController.addCategories);


router.post('/add-specialty/:id', upload.single("specialityImage"), categoriesController.addSpecialityToCategory);
// router.get('/getAll',categoriesController.getCategory);


router.post('/top-category',upload.single('img'),categoriesController.topCategory);
router.get('/get-topCategory',categoriesController.sendTopCategory);

router.delete('/remove-speciality/:categoryId',categoriesController.removeSpeciality);
router.get('/getCategory',categoriesController.getCategory);
router.get('/specialities/:categoryName',categoriesController.getSpecialities);

router.post('/contact',categoriesController.contactInfo);
router.get('/getContact',categoriesController.sendContact)
router.delete('/deleteContact/:id',categoriesController.deleteContact);

router.post('/login',categoriesController.login);

router.get('/get-temp-prov',categoriesController.getTempService);
router.get('/temp-service/:id',categoriesController.getTempServiceData)

router.get('/verifyTemp/:id',categoriesController.addVerifiedService);
router.post('/reject-tempUser/:id',categoriesController.rejectServiceProvider);

router.get('/me',protectRoute,(req,res)=>{
   res.status(200).json({
      success:true,
      user:req.user
  })

})
module.exports=router;