const { Error } = require("mongoose");
const OrderModel = require('../models/OrderModel');
const UserCart = require('../models/UserCart');
const mongoose = require('mongoose');
const Razorpay = require('razorpay'); // For requiring the RaZorpay

// for Ingrating Razorpay
var instance = new Razorpay({
  key_id: 'rzp_test_r2EEddYAuPS5ln',
  key_secret: 'Mu3tagonpOPv14VIdpxOW9o8',
});
 // Create  Rezorpay 
 const createRazorpay = async( orderId ,total)=>{
    return new Promise(async(resolve,reject)=>{
try {
    var options = {
        amount: total*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: ""+orderId
      };
      instance.orders.create(options, function (err, order) {
         if (err) {
             console.log("The is founded", err);
         } else {
             console.log(order);
             resolve(order)
         }
         // console.log(order);
     })
     
}catch (error) {
   console.log(error.message); 
}
    })
 }
 const getCart = async(userId)=>{
    console.log(userId);
    
        let cart =await UserCart.findOne({UserId: new mongoose.Types.ObjectId(userId)})
            
        if (cart) {
            console.log("the get Cart products",cart.Products);
             return cart.Products
        } else {
            return []// Return an empty array if cart not found
        }
   
}
const TotalAmounts= async(UserId)=>{
    const total = await UserCart.aggregate([
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
    if (total.length > 0) {
        // Access the total value from the aggregation result
        console.log(total[0].total);
        const totalPrice = total[0].total;
        return totalPrice;
    } else {
        // Handle the case where no data was found or total is zero
        return  null;
    }
}
const Load_Order_Form = async(req,res,next)=>{
    try {
        const UserId = req.session.user_id;
        console.log(UserId);
        // for count of Product in Cart
        let cartcount =null;
        let count =0
        const Cart = await UserCart.findOne({UserId:UserId})// for fetch the count of Cart
        // when checking the User have Cart
        if(Cart){
          count = Cart.Products.length
          console.log(count);

        }
        cartcount = count
    // for fetch the  shopping cart fetch to modal
        const CartItem = await UserCart.aggregate([
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

         ]);
        res.render('users/Order_placing',{
            title:'ORDER',
            User:UserId,
            cartcount,
            CartItems:CartItem,
        })
    } catch (error) {
        console.log(error.message);
    }
}
const Orderplacing = async(req,res,next)=>{
    try {
       console.log(req.body);
      const  user = req.body.UserId;
      const Products = await getCart(user);
       console.log(Products);
      const TotalAmount = await TotalAmounts(user);
      console.log(TotalAmount);
      let status = req.body['payment-method']==='COD'?'placed':'pending'
        // console.log(order,product,total);
        
        const orderList = new OrderModel({
                first_name:req.body.fname,
                last_name: req.body.lname,
                email:req.body.email,
                contact:req.body.mob,
                ShippingAddress1:req.body.faddress,
                ShippingAddress2:req.body.Saddress,
                City:req.body.city,
                State:req.body.state,
                Zip_code:req.body.pincode,
                Country:req.body.country,
                PaymentMethod:req.body['payment-method'],
                Status:status,
                products:Products,
                UserId:user,
                TotalAmount:TotalAmount,
                 date:new Date(),
        })
       
        
      const saveorder= await orderList.save()
      if(saveorder){
        await UserCart.findOneAndDelete({UserId:new mongoose.Types.ObjectId(saveorder.UserId)});
      }
      if (req.body['payment-method'] === 'COD') {
        res.json({ CODSuccess: true })
      }else{
        const orderId =saveorder._id;
        console.log(orderId);
       createRazorpay(orderId, TotalAmount).then(response =>{
        console.log(response);
        res.json(response)
       })
     
       
           
        
         
      }
   
      

       
    
 }
        
     catch (error) {
        console.log(error.message);
    }
}
const LoadSuccesBanner = async(req,res,next)=>{
    try {
      
       res.render('users/Success_banner',{
       
       }) 
    } catch (error) {
        console.log(error.message);
    }
}
// for Verify Payment Placing 
 const verifyPayments =(details)=>{
    return new Promise((resolve,reject)=>{
    
        let body =details['payment[razorpay_order_id]'] + "|" +  details['payment[razorpay_payment_id]']
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256','Mu3tagonpOPv14VIdpxOW9o8')
         .update(body.toString())
         .digest('hex')
        console.log(hmac);
        if(hmac === details['payment[razorpay_signature]']){
            resolve()
        }else{
            console.log("verification failed some error");
            reject()
        }
    
     })
 };
 // for changing the Status in database
 const changePaymentstatus =(orderId)=>{
    return new Promise((resolve,reject)=>{
        OrderModel.updateOne({_id: new mongoose.Types.ObjectId(orderId)},{
                $set:{status:'placed'}
            }).then((response)=>{
                resolve()
            }).catch((err)=>{
                console.log('some error');
                reject()
            })
    
        })
  
 }
 // for Verify and Change the Status
const verifyPayment =(req,res,next)=>{
   
    try {
      
        console.log(req.body);
        verifyPayments(req.body).then(() => {
          console.log(req.body['order[receipt]']);
          changePaymentstatus(req.body['order[receipt]']).then(() => {
            console.log('payment successfull');
            res.json({ status: true })
          }).catch((err) => {
            console.log(err)
            res.json({ status: 'Payment failed' })
          }).catch((err) => {
            console.log(err);
            res.json({ status: 'Payment verification failed' });
          })
      
        })
            
        
        
    } catch (error) {
        console.log(error.message);
    }

}
const  loadOrderPage = async(req,res,next)=>{
    try {
        const UserId = req.session.user_id;
        console.log(UserId);
        // for count of Product in Cart
        let cartcount =null;
        let count =0
        const Cart = await UserCart.findOne({UserId:UserId})// for fetch the count of Cart
        // when checking the User have Cart
        if(Cart){
          count = Cart.Products.length
          console.log(count);

        }
        cartcount = count
    // for fetch the  shopping cart fetch to modal
        const CartItem = await UserCart.aggregate([
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

         ]);
         // for fetching All Order Details 
         const OrderDetails = await OrderModel.find({})
         console.log(OrderDetails);
        res.render('users/Order_Page',{
            title:'Order',
            User:UserId,
            cartcount,
            CartItems:CartItem,
            Data:OrderDetails
        })
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    Load_Order_Form,
    Orderplacing,
    LoadSuccesBanner,
    verifyPayment,
    loadOrderPage
}