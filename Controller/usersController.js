const BannerModel = require('../models/BannerModel');
const SliderModel = require('../models/SliderModel');
const ProductModel =require('../models/ProductModel');
const { default: mongoose } = require('mongoose');

const LoadHome = async(req, res, next) => {
    try {
        const User =req.session.user_id
        const signupUserdata = req.session.userdata
        const SliderDetails =  await SliderModel.find({}).lean();
        const Banner =  await BannerModel.find({}).lean()
        const Product = await ProductModel.find({}).select('name  price images ,description')
        // console.log(Product);
        res.render('users/Userhome',{SliderData:SliderDetails,Banner:Banner,Product:Product,title:'Home',User,signupUserdata})
        

    } catch (error) {
        console.log(error.message);
    }
}
const quick_view = async(req,res,next) =>{
    try {
        
            const productId = req.params.productId;
          
            const product = await ProductModel.findById(productId);
            console.log(product)
            res.json({ product });
          } catch (error) {
            console.log(error.message);
            res.status(500).send('Internal Server Error');
          }
        
   
}

 
module.exports ={
   LoadHome,
   quick_view,
   
   
    
}