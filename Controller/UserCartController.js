 const { default: mongoose } = require('mongoose');
const UserCart = require('../models/UserCart');


 const Add_to_Cart = async(req,res,next)=>{
    try {
        console.log('api call');
        console.log(req.body);
        const ProId = req.params.id;
        const  userId = req.session.user_id ;
        const size = req.body.size;
        const color = req.body.color;
        console.log(userId);
        console.log(ProId);
        const UserCartdata = await UserCart.findOne({UserId:userId});
        console.log(UserCartdata);
        if(UserCartdata){
            console.log('This one');
            let proexist =  UserCartdata.Products.findIndex(product => product.item == ProId && product.Size==size&& product.color==color);
            console.log(proexist);
            if(proexist!=-1){
                UserCartdata.Products[proexist].quantity+=1
            }else{
                UserCartdata.Products.push({item:ProId,Size:size,color:color,quantity:req.body.quantity});
            }
            let UpdatedCart = await UserCartdata.save();
            if(UpdatedCart){
                res.json({status : true})
            }
           
        }else{
            console.log('hi');
            let Cart = UserCart.create({
                UserId:userId,
                Products:[{
                    item:ProId,
                    Size:req.body.size,
                    color:req.body.color,
                    quantity:req.body.quantity
                }
                   ]
            });
            
           
                res.json({status:true});
            
            
        }

    } catch (error) {
        console.log(error.message);
    }
 }
 const LoadCart = async(req,res,next)=>{
    try {
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
         console.log(CartItem);
         res.render('users/Shopping_Cart',{title:'Shopping_cart',CartItems:CartItem});
        
    } catch (error) {
       console.log(error.message); 
    }
 }
  const RemoveCart =(req,res,next)=>{
    try {
        CartId = req.body.CartId;
        ProId =req.body.ProId
        console.log(CartId);
        console.log(ProId);
    } catch (error) {
       console.log(error.message); 
    }
  }
  // for Updating Quantity Plus or minus
  const Update_quantity = async(req,res,next)=>{
    try {
        console.log(req.body);
        const CartId = req.body.cartId;
        const ProId = req.body.proId;
        const UserId = req.session.user_id;
        const count = parseInt(req.body.count);
        const quantity = parseInt(req.body.quantity);
        const Size =req.body.size;
        const color =req.body.color;
        console.log(count);
        console.log(quantity);
        console.log(Size);
        console.log(color);
        if(count == -1 && quantity == 1){
            const UpdatedCart =  await UserCart.updateOne({
                 _id: new mongoose.Types.ObjectId(CartId)
            },{
                $pull:{Products:{$and:[{item: new mongoose.Types.ObjectId(ProId)},{Size:Size},{color:color}]}}
            });
            console.log(UpdatedCart);
            if(UpdatedCart){
                res.json({removeProduct: true});
            }
        }else{
            try {
                const cart = await UserCart.findOne({ _id: new mongoose.Types.ObjectId(CartId) });
                
                if (cart) {
                    let productIndex = cart.Products.findIndex(product => product.item == ProId && product.Size==Size&& product.color==color);
                    console.log(productIndex);
                    if (productIndex !== -1) {
                        if (count == -1) {
                            cart.Products[productIndex].quantity -= -count;
                        } else {
                            cart.Products[productIndex].quantity += count;
                        }
                        
                     const  UpdatedCart = await cart.save();
                     if(UpdatedCart){
                        res.json({status:true})
                     }
                       
                    }
                }
            } catch (error) {
               console.log(error.message);
            }
        }
    } catch (error) {
       console.log(error.message); 
    }
  }
  // for quantity increase the price will be increase
  const totalProductPrice =async (req,res,next)=>{
    try {
        const UserId = req.session.user_id;
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
                
            }
            ,{
                $group:{
                    _id:null,
                    total:{$multiply:['$quantity','$product.price']}
                }
            }
            
        ])
        console.log(total);
    } catch (error) {
      console.log(error.message);  
    }
  }
 module.exports ={
    Add_to_Cart,
    LoadCart,
    RemoveCart,
    Update_quantity,
    totalProductPrice
 }