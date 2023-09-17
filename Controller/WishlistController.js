// WishList 
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const WishListModel =require('../models/Wishlistmodel');
const UserCart = require('../models/UserCart');
const Wishlist = async(req,res,next)=>{
    try {
        console.log('Wish List add');
        const ProId =req.params.id;
        const  userId = req.session.user_id ;
        console.log(userId);
        console.log(ProId);
        const WishListdata = await WishListModel.findOne({UserId:userId});
       
        if(WishListdata){
            console.log('This one');
            let proexist = WishListdata.Products.findIndex(product => product.item == ProId );
            console.log(proexist);
            if(proexist!=-1){
                WishListdata.Products[proexist].count+=1
            }else{
                WishListdata.Products.push({item:ProId});
            }
            let UpdatedWishList = await WishListdata.save();
            if(UpdatedWishList){
                res.json({status : true})
            }
           
        }else{
            console.log('hi');
            let Cart = WishListModel.create({
                UserId:userId,
                count:1,
                Products:[{
                    item:ProId,
                    }
                   ]
            });
            res.json({status:true});
           
             }

    } catch (error) {
        console.log(error.message);
    }
}
// for load Wishlist Page
const LoadWishList = async(req,res,next)=>{
    try {
        const User =req.session.user_id
      
     // for fetch the All Product in Wishlist
     let Products = await WishListModel.aggregate([
        {
            $match:{
                UserId : new mongoose.Types.ObjectId(User) 
            }
        },
        {
            $unwind:'$Products'
        },
        {
            $project:{
                item:"$Products.item",
                
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
                    item:1,product:{$arrayElemAt:['$product',0]}
                }
            
        },
        
     
        
    ]);
    
       

        console.log(Products);
        let cartcount =null;
        let count =0
        const Cart = await UserCart.findOne({UserId:User})// for fetch the count of Cart
        // when checking the User have Cart
        if(Cart){
          count = Cart.Products.length
          console.log(count);

        }
        cartcount = count
        // for count the wishlist
        let WishListcount =null;
        let Counts =0
        const wishlist = await WishListModel.findOne({UserId:User})// for fetch the count of Cart
        // when checking the User have Cart
        if(wishlist){
            Counts = wishlist.Products.length
          console.log( Counts);

        }
        WishListcount =  Counts
        // For Fetching the data into Cart Modal
        
          const user = req.session.user_id
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
           
          
           
        // console.log(Product);
        res.render('users/Wishlist',{
           
            products: Products,
            title:'WishList',
            User,
            cartcount,
            CartItem:CartItem,
            WishListcount
           
        })
    } catch (error) {
        console.log(error.message);
    }
}
// Delete Product in Wishlist
const DeletProduct = async(req,res,next)=>{
    try {
        ProId =req.params.id;
        const User = req.session.user_id;
        console.log( 'This is the Product Id ',ProId);
   
    const DeletedProduct = await WishListModel.findOneAndUpdate(
        { UserId: new mongoose.Types.ObjectId(User) },
        { $pull: { Products: { item: new mongoose.Types.ObjectId( ProId )} } },
        
      )
     if(DeletedProduct)res.redirect('/Wishlist')
    
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    Wishlist,
    LoadWishList,
    DeletProduct,
 
}