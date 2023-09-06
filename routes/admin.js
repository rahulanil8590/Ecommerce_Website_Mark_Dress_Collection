var express = require('express');
var router = express.Router();
// get the Controller 
let adminController = require('../Controller/adminController');
const HomePageSliderController =require('../Controller/HomePageSlider');
const BannerController = require('../Controller/BannerController');
const CategoryController = require('../Controller/CategoryController');
const ProductController = require('../Controller/ProductController');
const BlogController = require('../Controller/BlogController');
const AboutController = require('../Controller/AboutController');

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

// ---Sub_Category------
// get request
router.get('/add_Sub_Category',CategoryController.Insert_Sub_Category );
router.get('/display_Sub_Category',CategoryController.View_Sub_Categories)
// Post Request
router.post('/add_Sub_Category' , CategoryController.Insert_Sub_Cat_to_mon_db);
// ____Product______________
// get request
router.get('/add_Product',ProductController.Insert_Product);
router.get('/View_Product',ProductController.view_product);
router.get('/Edit_image1/:id',ProductController.Edit_image1);
// Post Request
router.post('/add_Product',ProductController.Store_Product_Images,ProductController.Insert_to_product_mon_db);
// For fetching  Blog data
// Get request
router.get('/add_Blog',BlogController.LoadBlogFormPage);
router.get('/View_Blog',BlogController.Load_Display_Blog);
router.get('/Edit_Blog/:id',BlogController.editBlog);
router.get('/delete_Blog/:id',BlogController.DeleteBlog)
// Post Request
router.post('/add_Blog',BlogController.addBlogImageSavingFile,BlogController.Inset_Blog_Data);
router.post('/Edit_Blog/:id',BlogController.UpdateBlog);
// For fetching  About data
// Get request
router.get('/add_about',AboutController.LoadAboutFormPage);
router.get('/View_about',AboutController.Load_Display_About);
router.get('/Edit_About/:id',AboutController.editAbout);
router.get('/delete_About/:id',AboutController.DeleteAbout)
// Post Request
router.post('/add_about',AboutController.addAboutImageSavingFile,AboutController.Inset_About_Data);
router.post('/Edit_About/:id',AboutController.UpdateAbout);
module.exports = router;
