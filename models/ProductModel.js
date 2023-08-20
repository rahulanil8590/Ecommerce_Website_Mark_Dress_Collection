const mongoose = require('mongoose');
const ProductSchema =  new mongoose.Schema({
    name:{
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
    image:{
        type:String,
        default:""
    },
    images:[{
        type:String,
        default:""
    }],
    brand:{
        type:String,
        default:""
    },
    price:{
        type:Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        require:true
    },
    product_Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product_category",
        require:true

    },
    countInStock:{
        type:Number,
        require:true,
        min:0,
        max:500
    },
    rating:{
        type:Number,
        default:0
    },
    numReview:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});
const ProductModel = mongoose.model('productmodel',ProductSchema);
module.exports = ProductModel