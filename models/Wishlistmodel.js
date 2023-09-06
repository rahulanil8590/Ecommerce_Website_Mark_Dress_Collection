const mongoose = require('mongoose');
const WishlistSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usermodel'
    },
    Products:[
        {
            item:mongoose.Schema.Types.ObjectId,
            
        }
    ]   
});
 const wishlist = mongoose.model('wishlist',WishlistSchema);
 module.exports = wishlist