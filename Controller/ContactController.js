const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const UserCart = require('../models/UserCart');
const nodemailer = require('nodemailer'); // for send the mail to verify the signup 
const config = require('../config/config');// for configure the Private Data

const Sendmail =(Useremail,Message)=>{
    try {
      const transportmail =  nodemailer.createTransport({
           host:'smtp.gmail.com',
           port:587,
           secure:false,
           requireTLS:true,
           auth:{
            user:config.emailUser,
            pass:config.emailpassword
           }
        })
        const mailoption = {
            from:Useremail,
            to:config.emailUser,
            subject:' For Contact mail',
            html:'<p>'+Message+'</p> '
        }
        transportmail.sendMail(mailoption,function(error,info){
            if(error){
                console.log(error.message);
            }else{
                console.log(' Email has been send :-',info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

const LoadContact =async(req,res,next)=>{
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
       
        
         
   
// for Details pass the  render  Blog ejs file
         res.render('users/Contact',
        {
        title:'Blog',
         User:UserId,
         cartcount,
         CartItems:CartItem,
        
        });

    } catch (error) {
        console.log(error.message);
    }
  }
  const SendMesageFromUser =(req,res,next)=>{
    try {
        const UserEmail =req.body.email;
        const Message =req.body.msg
        Sendmail(UserEmail,Message );
        res.redirect('/Contact')
    } catch (error) {
        console.log(error.message);
    }
  }


  module.exports ={
    LoadContact,
    SendMesageFromUser
  }