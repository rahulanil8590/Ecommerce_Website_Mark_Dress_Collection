var express = require('express');
var router = express.Router();
// get the Controller 
let adminController = require('../Controller/adminController');
const HomePageSliderController =require('../Controller/HomePageSlider');
const BannerController = require('../Controller/BannerController');
const CategoryController = require('../Controller/CategoryController');

/* GET Admin listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});
// Slider Section 
// get Request
router.get('/display_slider',HomePageSliderController.DisplaySlider);
router.get('/add_slider',HomePageSliderController.Slider);
router.get('/edit_Slider/:id', HomePageSliderController.EditSlider);
router.get('/delete_Slider/:id',HomePageSliderController.deleteSlider);
// Post Request
router.post('/add_slider',HomePageSliderController. addSliderImageSavingFile,HomePageSliderController.addSlider);
router.post('/edit_Slider/:id', HomePageSliderController.addSliderImageSavingFile,HomePageSliderController.EditedSlider);

//Slider Section end
//--------Banner --------//
// get Request
router.get('/display_Banner', BannerController.Load_Display_Banner);
router.get('/add_Banner', BannerController.addBanner);
router.get('/edit_Banner/:id', BannerController.editBanner);
router.get('/delete_Banner',BannerController.DeleteBanner)
// Post Request
router.post('/add_Banner' ,BannerController.addBannerImageSavingFile, BannerController.add_to_mongodb);
router.post('/edit_Banner/:id',BannerController.addBannerImageSavingFile,BannerController.UpdateBanner);
//-----Category ------//

// get Request
router.get('/add_Category',CategoryController.InsertCategory );
router.get('/View_Category',CategoryController.View_Categories)
router.get('/edit_Category/:id', CategoryController.EditCategory);
router.get('/delete_Category/:id',CategoryController.DeleteCategory);
// Post Request
router.post('/add_Category' , CategoryController.Insert_Cat_to_mon_db);
router.post('/edit_Category/:id',CategoryController.UpdateCategory);
module.exports = router;
