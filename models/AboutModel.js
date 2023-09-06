const mongoose = require('mongoose');
const AboutSchema =  new mongoose.Schema({
    title1:{
        type:String,
        require:true
    },
    title2:{
        type:String,
        require:true
    },
    Para1:{
        type:String,
        require:true
    },
    para2:{
        type:String,
        require:true
    },
   para3:{
        type:String,
        require:true
    },
    para4:{
        type:String,
        require:true
    },
    images:{
        type:Array,
        default:""
    },
    Thought:{
        type:String,
        default:""
    }
});
const AboutModel = mongoose.model('aboutmodel',AboutSchema);
module.exports = AboutModel;