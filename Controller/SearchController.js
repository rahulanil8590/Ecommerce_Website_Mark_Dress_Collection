const ProductModel = require('../models/ProductModel');
const UserCart = require('../models/UserCart');
const mongoose = require('mongoose');
const Searchproduct = async(req,res,next)=>{
    try {
        const searchQuery = req.query.searchProduct; // Get the search query from the request query parameters
        console.log(searchQuery);
            // Use a regular expression to perform a case-insensitive search on product names
        const products = await ProductModel.find({ name: { $regex: new RegExp(searchQuery, 'i') } });
        console.log('this is Header Search Product',products);
      
       
        

  
      
        const user = req.session.user_id
        let cartcount =null;
        let count =0
        const Cart = await UserCart.findOne({UserId:user})// for fetch the count of Cart
        // when checking the User have Cart
        if(Cart){
          count = Cart.Products.length
          console.log(count);

        }
        cartcount = count
        // For Fetching the data into Cart Modal
        
        
           const CartItem = await UserCart.aggregate([
              {
                  $match:{
                      UserId : new mongoose.Types.ObjectId(user) 
                  }
              },
              {
                  $unwind:'$Products'
              },
              {
                  $project:{
                      item:"$Products.item",
                      Size:"$Products.Size",
                      color:"$Products.color",
                      quantity:"$Products.quantity"
                  }
              },
              {
                  $lookup:{
                      from:'productmodels',
                      localField:'item',
                      foreignField:'_id',
                      as:'product'
                    }
              },
              {
                  
                      $project:{
                          item:1,quantity:1,Size:1,color:1,product:{$arrayElemAt:['$product',0]}
                      }
                  
              }
  
           ]) 
          
        res.render('users/search-results', { 
            products:products,
            searchQuery:searchQuery,
            User:user,
            cartcount,
            CartItem:CartItem
        });
   
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}
// for Banner Category Products Showing
const SearchBannerCategory =async (req,res,next)=>{
    try {
      const CategoryId= req.params.id;
      const product = await ProductModel.find({category:new mongoose.Types.ObjectId(CategoryId)});
      console.log('this is the Search Product',product);
      const user = req.session.user_id
      let cartcount =null;
      let count =0
      const Cart = await UserCart.findOne({UserId:user})// for fetch the count of Cart
      // when checking the User have Cart
      if(Cart){
        count = Cart.Products.length
        console.log(count);

      }
      cartcount = count
      // For Fetching the data into Cart Modal
      
      
         const CartItem = await UserCart.aggregate([
            {
                $match:{
                    UserId : new mongoose.Types.ObjectId(user) 
                }
            },
            {
                $unwind:'$Products'
            },
            {
                $project:{
                    item:"$Products.item",
                    Size:"$Products.Size",
                    color:"$Products.color",
                    quantity:"$Products.quantity"
                }
            },
            {
                $lookup:{
                    from:'productmodels',
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                  }
            },
            {
                
                    $project:{
                        item:1,quantity:1,Size:1,color:1,product:{$arrayElemAt:['$product',0]}
                    }
                
            }

         ]) 
      res.render('users/shop_Banner_Category',{
        title:'Shop',
        product,
        User:user,
        cartcount,
        CartItem:CartItem
    });
      
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    Searchproduct,
    SearchBannerCategory
}