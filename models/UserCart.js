const mongoose = require('mongoose');
const UserCartSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usermodel'
    },
    Products:[
        {
            item:mongoose.Schema.Types.ObjectId,
            Size:String,
            color:String,
            quantity:Number
        }
    ]   
});
 const UserCart = mongoose.model('usercart',UserCartSchema);
 module.exports =UserCart