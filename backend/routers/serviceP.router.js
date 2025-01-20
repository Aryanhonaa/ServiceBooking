const express=require('express');
const router=express.Router();
const upload=require('../middleware/multer');
const serviceController=require('../controllers/service.controller');


router.post('/addProv',upload.fields([
    {name:'image1', maxCount:1},
    {name:'image2', maxCount:1},
    {name:'image3', maxCount:1},
]),
serviceController.addProvider);

router.post('/loginService',serviceController.login);


module.exports=router;