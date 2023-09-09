const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt'); //  bcrypt library add to hash password to secure
const nodemailer = require('nodemailer'); // for send the mail to verify the signup
const randomString = require('randomstring');// for forget password to uniquenest 
const config = require('../config/config');
const mongoose = require('mongoose');
const User_multer = require('../multer/User_image_multer');
const LoadLogin = (req,res,next)=>{
    try {
        res.render('admin/login',{title:'Login'})
    } catch (error) {
        console.log(error.message);
    }
}
 const VerifyLogin = async(req,res,next)=>{
    try {
        const email =req.body.email;
        const password =req.body.password;
        const userdata = await UserModel.findOne({Email:email})
        if(userdata){
            const passwordMatch = await bcrypt.compare(password,userdata.Password);
            if(passwordMatch){
                if( userdata.is_admin === 0){
                    res.render('admin/login',{message:'Your not a Admin '}) 
                }else{
                    req.session.admin_id = userdata._id
                    console.log( req.session.admin_id);
                    
                    res.redirect('/admin/')
                }
            }
            else{
                res.render('admin/login',{message:'Invaild password or email '})
            }
        }else{
            res.render('admin/login',{message:'Invaild password or email '})
        }
    } catch (error) {
       console.log(error.message); 
    }
 }
// for logout 
const adminlogout = (req,res,next)=>{
    try {
        req.session.admin_id =null;
       
        res.redirect('/admin/login');
    } catch (error) {
       console.log(error.message); 
    }
 }


 // for reset password page loading
const LoadResetPassword = (req,res,next) =>{
    try {
        try {
            res.render('admin/forget_password')
        } catch (error) {
            console.log(error.message);
        }
        
    } catch (error) {
        console.log(error.message);
    }
}
// for send reset password mail 
const sendresetVerify =(name,email,token)=>{
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
            from:config.emailUser,
            to:email,
            subject:' For Reset Password ',
            html:'<p>Hii '+name+' please click  here to <a href ="http://localhost:3000/admin/forget_password/'+token+'">Reset</a> your Password </p> '
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

// for verfy the email to check Reseting password
const Verify_mail_Reset_password = async(req,res,next)=>{
    try {
        const email =  req.body.email;
        const userdata = await UserModel.findOne({Email:email});
        if(userdata){
         if(userdata.is_admin === 0){
             res.render('admin/forget_password',{message:' Your not a admin'})
             
         }else{
             const randomstring =randomString.generate();
             const updateddata =await UserModel.updateOne({Email:email},{
                 $set:{
                     token:randomstring
                 }
             })
             sendresetVerify(userdata.name,userdata.Email,randomstring);
             res.render('admin/forget_password',{message:'Please check your mail to Reset password'})
         }
        }else{
         res.render('admin/forget_password',{message:'Invaild User Email'})
        }
   
  
    } catch (error) {
      console.log(error.message);  
    }
}
// for reset Password entering page 
const loadforgetpassword =async(req,res,next)=>{
    try {
        token_id = req.params.id
        console.log(token_id);
        const tokendata = await UserModel.findOne({token:token_id})
        console.log(tokendata);
        if(tokendata){
            res.render('admin/forget_pass',{user_id:tokendata._id,title:'Reset Password'});
        }else{
            res.render('users/404',{message:'invaild token'})
        }
        
        
    } catch (error) {
        console.log(error.message);
    }
 }
 // for updating the Password in User
 const Updateforgetpassword = async(req,res,next)=>{
    try {
        console.log(req.params.id);
        const resetpassword = await bcrypt.hash(req.body.password,10);
        console.log("this is the reset password",resetpassword);
         const user_id=req.body.user_id
        const Updatedpassword = await UserModel.findByIdAndUpdate({_id:user_id},{
            $set:{
                Password:resetpassword,
                token:''
            }
        })
        res.redirect('/admin/login');
    } catch (error) {
        console.log(error.message);
    }
 }
 // for Profile admin
 const LoadProfile = async(req,res,next)=>{
    try {
        const isadmin =  req.session.admin_id;
        // for fetch the Admin Details 
 const Data = await UserModel.findOne({_id:isadmin});
        res.render('admin/profile',{
            title:'Profile',
            Isadmin:isadmin,
            Data
        });
    } catch (error) {
       console.log(error.message); 
    }
 }
 // for Upload Image using Multer 
 const InsertUserImage = User_multer.single('Image')

 // for Update the User Account
 const UpdatedProfile = async(req,res,next)=>{
    try{
        if(req.file){
             image = req.file.filename
        }else{
            console.log('image');
           let UserImage = await UserModel.findOne({_id: new mongoose.Types.ObjectId(req.params.id)});
           image = UserImage.Image;
        }
        console.log(req.body);
        UserModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{
            name: req.body.name, 
            Email: req.body.email,
            Phone:req.body.phone,
            Mobile:req.body.mob,
            Address:req.body.address,
            Image: image ,


        }).then(response =>{
            res.redirect('/admin/profile')
        }).catch(error =>{
            console.log(error.message);
            res.status(500).send('Error Message Come to update Banner Will be failed.');
            
        })
       
    }catch(error){
        console.log(error.message);

    }
  }
module.exports={
    LoadLogin,
    VerifyLogin,
    LoadResetPassword,
    Verify_mail_Reset_password ,
    loadforgetpassword,
    Updateforgetpassword,
    adminlogout,
    LoadProfile,
    InsertUserImage,
    UpdatedProfile
}