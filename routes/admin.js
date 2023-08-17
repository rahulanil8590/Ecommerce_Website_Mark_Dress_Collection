var express = require('express');
var router = express.Router();
// get the Controller 
let adminController = require('../Controller/adminController')

/* GET Admin listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});
// Slider Section 
router.get('/display_slider',adminController.DisplaySlider);
router.get('/add_slider',adminController.Slider);
router.post('/add_slider',adminController. addSliderImageSavingFile,adminController.addSlider);
router.get('/edit_Slider/:id', adminController.EditSlider);
router.post('/edit_Slider/:id', adminController.addSliderImageSavingFile,adminController.EditedSlider);
router.get('/delete_Slider/:id',adminController.deleteSlider);
//Slider Section end
module.exports = router;
