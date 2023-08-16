var express = require('express');
var router = express.Router();
const UserController = require('../Controller/usersController');

/* GET home page. */
router.get('/',UserController.GetSlider);

module.exports = router;
