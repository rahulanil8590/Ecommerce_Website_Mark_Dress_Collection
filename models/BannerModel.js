const mongoose = require('mongoose') 
//  creating schema and model for Banner
let Banner_model_Detail = new mongoose.Schema({
    Sub_header:{
     type:String,
     require:true
    },

    Main_header:{
        type:String,
        require:true
    },
    Image_url:{
        type:String,
        require:true
    },
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category",
        require:true
    }
});// creating All structure Model
 const BannerModel =  mongoose.model('bannermodel',Banner_model_Detail); // creating model
 module.exports = BannerModel; // export the BannerModel 