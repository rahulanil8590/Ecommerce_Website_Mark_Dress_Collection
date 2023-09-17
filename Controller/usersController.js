const BannerModel = require('../models/BannerModel');
const SliderModel = require('../models/SliderModel');
const ProductModel =require('../models/ProductModel');
const { default: mongoose } = require('mongoose');
const UserCart = require('../models/UserCart');
const WishListModel =require('../models/Wishlistmodel')

  // for Total Amount Product in Cart 
  const totalProductPrice =async (userId,Size,Color)=>{
    try {
        const UserId = userId;
        const size =Size;
        const color = Color
        console.log(UserId);
        console.log('this is total');
        let total = await UserCart.aggregate([
            {
                $match:{
                    UserId : new mongoose.Types.ObjectId(UserId) 
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
                
            },
            
            {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                
            }
            
        ]);
        console.log(total);
        console.log(total[0].total);
        if (total.length > 0) {
            // Access the total value from the aggregation result
            const totalPrice = total[0].total;
            return totalPrice;
        } else {
            // Handle the case where no data was found or total is zero
            return 0;
        }
        
    } catch (error) {
      console.log(error.message);  
    }
  }


const LoadHome = async(req, res, next) => {
    try {
        const User =req.session.user_id
        const signupUserdata = req.session.userdata
        const SliderDetails =  await SliderModel.find({}).lean();
        const Banner =  await BannerModel.find({}).lean()
        const Product = await ProductModel.find({}).populate('category').limit(3)
        console.log(Product);
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
          
           // for fetch the All Product in Wishlist
     let WishlistProducts = await WishListModel.aggregate([
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
    
// for call the total Amount function
   const totalPrice = await totalProductPrice(User);
      
   

        console.log(WishlistProducts);
        // console.log(Product);
        res.render('users/Userhome',{
            SliderData:SliderDetails,
            Banner:Banner,
            Product:Product,
            title:'Home',
            User,
            signupUserdata,
            cartcount,
            CartItem:CartItem,
            WishListcount,
            WishlistProducts,
            totalPrice
           
        })
        

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
const load_More = async(req, res, next) => {
    try {
        const User =req.session.user_id
        const signupUserdata = req.session.userdata
        const SliderDetails =  await SliderModel.find({}).lean();
        const Banner =  await BannerModel.find({}).lean()
        const Product = await ProductModel.find({}).select('name  price images ,description')
        let cartcount =null;
        let count =0
        const Cart = await UserCart.findOne({UserId:User})// for fetch the count of Cart
        // when checking the User have Cart
        if(Cart){
          count = Cart.Products.length
          console.log(count);

        }
        cartcount = count
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
                 // for fetch the All Product in Wishlist
     let WishlistProducts = await WishListModel.aggregate([
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

          
           
        // console.log(Product);
        res.render('users/Home_page_load-More',{
            SliderData:SliderDetails,
            Banner:Banner,
            Product:Product,
            title:'Home',
            User,
            signupUserdata,
            cartcount,
            CartItem:CartItem,
            WishlistProducts,
            WishListcount
           
        })
        

    } catch (error) {
        console.log(error.message);
    }
}

 
module.exports ={
   LoadHome,
   quick_view,
   load_More
   
    
}