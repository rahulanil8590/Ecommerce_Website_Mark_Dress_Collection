const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const Sub_CategoryModel = require('../models/SubCategoryModel');
const Product_image = require('../multer/Product_multer');
const { default: mongoose } = require('mongoose');


//  insert Product
const Insert_Product = async (req, res, next) => {
    try {
        const Category = await CategoryModel.find({}).lean();
        const Sub_Category = await Sub_CategoryModel.find({}).lean()
        res.render('admin/Insert_Product', { Category, Sub_Category, title: "Insert_product" })
    } catch (error) {
        console.log(error.message);
    }
}

const Store_Product_Images = Product_image.array('gallery', 4);
const Insert_to_product_mon_db = async (req, res, next) => {
    try {
        console.log(req.body);
        const Category = await CategoryModel.find({ _id: req.body.category });
        const Sub_Category = await Sub_CategoryModel.find({ _id: req.body.pro_cat });
        if (!Category && !Sub_Category) return res.status(404).send('Invaild Category Or Sub_Category');
        console.log(req.files);
        const imagearray = [];
        for(file of req.files){
            imagearray.push(file.filename)
        }
        console.log(imagearray);
        const Product = new ProductModel({
            name: req.body.product_name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            images: imagearray,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            product_Category: req.body.pro_cat,
            countInStock: req.body.CountInStock,
            rating: req.body.Rating,
            numReview: req.body.Review,
            isFeatured: req.body.feature,
            
        })
        if (!Product) return res.status(500).send('Error uploading product');
        await Product.save()
        res.redirect('/admin/add_Product')

    } catch (error) {
        console.log(error.message);
    }
}
 const view_product = async(req,res,next)=>{
    try {
     const ProductDetails =  await ProductModel.find({}).lean()
        res.render('admin/View_Product',{data:ProductDetails,title:'View_product'})
    } catch (error) {
        console.log(error.message);
    }
 }
 const Edit_image1 = (req,res,next)=>{
    try {
        const image1 = ProductModel.find({_id:new mongoose.Types.ObjectId(req.params.id)});
       
         res.render('admin/Edit_image',{productImage:image1});
    } catch (error) {
        console.log(error.message);
    }
 }

 // User Product Details
 const fetch_Product_Details = async(req,res,next)=>{
    try {
        ProductDetails =await ProductModel.findById(req.params.id);
        const  categoryId = ProductDetails.category;
        const category=  await CategoryModel.find({_id:categoryId})
        console.log(category);
         const sub_category = ProductDetails.product_Category;
        console.log(category);
        console.log(sub_category);
        res.render('users/Product_Details',{ProductDetails,title:'Product_details'});
    } catch (error) {
        console.log(error.message);
    }
 }

 const addreview = (req,res,next)=>{
    try {
        console.log(req.body);
    } catch (error) {
        console.log(error.message);
    }
 }
module.exports = {
    Insert_Product,
    Insert_to_product_mon_db,
    Store_Product_Images,
    view_product,
    Edit_image1,
    fetch_Product_Details,
    addreview
  
}