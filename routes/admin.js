var express = require('express');
var router = express.Router();
// get the Controller 
let adminController = require('../Controller/adminController')

/* GET Admin listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});
router.get('/add_slider',adminController.Slider);
router.post('/add_slider',adminController.addSliderToMongodb,adminController.addSlider);

module.exports = router;
