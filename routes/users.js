var express = require('express');
var router = express.Router();
const UserController = require('../Controller/usersController');
const ProductController= require('../Controller/ProductController');
const UserSignupandloginController = require('../Controller/UserSignupandloginController');
const UserCartController = require('../Controller/UserCartController');
const WishlistController = require('../Controller/WishlistController');
const BlogController = require('../Controller/BlogController');
const AboutController = require('../Controller/AboutController');
// for auth middleware 
const auth = require('../middleware/auth')


/* GET home page. */
router.get('/',UserController.LoadHome);
// Quick View Of Product
router.get('/get-product-details/:productId',UserController.quick_view)
router.get('/Product_details/:id',auth.is_Login,ProductController.fetch_Product_Details);
router.post('/add_review/:id',ProductController.addreview);
// User signup 
router.get('/SignUp',auth.is_Logout,UserSignupandloginController.Usersignup);
router.post('/SignUp',UserSignupandloginController.addtoMongUsersignup);
// for verify mail
router.get('/verify/:id',UserSignupandloginController.verify)
// for  User login
router.get('/login',auth.is_Logout,UserSignupandloginController.loadlogin);
router.post('/login',UserSignupandloginController.verifylogin);
// for  User logout
router.get('/logout',auth.is_Login,UserSignupandloginController.Userlogout);
// For forgot Password 
router.get('/forget',auth.is_Logout,UserSignupandloginController.loadforgetform);
router.post('/forget',UserSignupandloginController.VerifyForget)
router.get('/forget_password/:id',auth.is_Logout,UserSignupandloginController.loadforgetpassword);
router.post('/forget_password/:id',UserSignupandloginController.Updateforgetpassword);
//  for Add to cart 
router.post('/add-to-cart/:id',UserCartController.Add_to_Cart);
router.get('/Load_cart',auth.is_Login,UserCartController.LoadCart);
router.post('/Update_quantity',UserCartController.Update_quantity);
router.post('/remove-cart',UserCartController.RemoveCart);
// for FEtch the Product abd display the shop page to All Product
router.get('/Shop',ProductController.LoadShop);
// for add and fetch the wishlist
// 
// For Blog Page
router.get('/blog',auth.is_Login,BlogController.LoadBlog);
router.get('/blog_detail/:id',auth.is_Login,BlogController.LoadBlogdetailed);
// For About Page 
router.get('/about',AboutController.LoadAbout);
module.exports = router;
