const ProductModel = require('../models/ProductModel');

//  insert Product
const Insert_Product = (req,res,next)=>{
    try {
        res.render('admin/Insert_Product')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports ={
    Insert_Product
}