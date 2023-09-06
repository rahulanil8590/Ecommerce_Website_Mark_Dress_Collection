const mongoose = require('mongoose') 
//  creating schema and model for BLog
const BlogSchema =  new mongoose.Schema({
    head_image:{
        type:String,
        require:true
    },
    Title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    richDescription:{
        type:String,
       default:" "
    },
    Blog_image:{
        type:String,
        require:true
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});
const BlogModel = mongoose.model('blogmodels',BlogSchema);
module.exports = BlogModel;