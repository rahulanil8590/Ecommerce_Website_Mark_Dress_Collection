const mongoose = require('mongoose');
const Sub_Category_Schema = new mongoose.Schema({
    parent_Category_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    Sub_Category:{
        type:String,
        require:true
    }
});
 const Sub_Category_Model = mongoose.model('Sub_category',Sub_Category_Schema);
 module.exports=Sub_Category_Model