var express = require('express');
var router = express.Router();
const UserController = require('../Controller/usersController');
const ProductController= require('../Controller/ProductController');

/* GET home page. */
router.get('/',UserController.LoadHome);
// Quick View Of Product
router.get('/get-product-details/:productId',UserController.quick_view)
router.get('/Product_details/:id',ProductController.fetch_Product_Details);
router.post('/add_review/:id',ProductController.addreview);

module.exports = router;
