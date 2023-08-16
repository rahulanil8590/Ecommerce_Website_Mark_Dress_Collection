const mongoose = require('mongoose') 
//  creating schema and model for Slider 
let slider_model_Detail = new mongoose.Schema({
    Sub_header:String,
    Main_header:String,
    Image_url:String
});// creating All structure Model
 const SliderModel =  mongoose.model('slidermodel',slider_model_Detail); // creating model
 module.exports = SliderModel; // export the sliderModel 