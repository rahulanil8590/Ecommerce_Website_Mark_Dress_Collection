const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt'); //  bcrypt library add to hash password to secure
const nodemailer = require('nodemailer'); // for send the mail to verify the signup
const randomString = require('randomstring');// for forget password to uniquenest 
const config = require('../config/config');


// for send mail 
const sendVerifyMail =(name,email,UserId)=>{
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
            subject:' For verification mail',
            html:'<p>Hii '+name+' please click  here to <a href ="http://localhost:3000/verify/'+UserId+'">verify</a> your mail </p> '
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




 const Usersignup = (req,res,next)=>{
    try {
        res.render('users/UserSignUp',{SignUpErr:false})
    } catch (error) {
        console.log(error.message)
    }
 }
 const addtoMongUsersignup = async(req,res,next)=>{
    try {
        req.session.userdata = req.body;
        console.log( req.session.userdata);
        const found =  await UserModel.findOne({Email:req.body.email});
        if(found){
            res.render('users/UserSignUp',{message:'Email  is Already exits ' ,SignUpErr:false});
        }else{

        
        if(req.body.password === req.body.repeatpassword){
             const SignUpErr = false
            const Usersignup = new UserModel()
               Usersignup.name = req.body.name,
               Usersignup.Email=req.body.email,
               Usersignup.Password=  await bcrypt.hash(req.body.password,10);
               Usersignup.is_admin=0

           const userdata = await  Usersignup.save();
           
           
           if(userdata){
            console.log(userdata);
            sendVerifyMail(req.body.name,req.body.email,userdata._id);
            res.render('users/UserSignUp',{message:'Your Registration is Successfuly completed . Please check email verification',SignUpErr:false});
           }else{
            res.render('users/UserSignUp',{message:'Your Registration is Failed' ,SignUpErr:true});
           }
           
        }else{
            console.log('hi');
            res.render('users/UserSignUp',{SignUpErr:true});
        }
    }
        console.log(req.body);
    
    } catch (error) {
        console.log(error.message)
    }
 }
 const verify = async(req,res)=>{
    try {
        userId = req.params.id
        console.log(userId);
      
        const Updateinfo = await UserModel.updateOne({_id:req.params.id},{
            $set:{
                is_verified:1
            }
        })
        console.log(Updateinfo);
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
 }
 const loadlogin =(req,res,next)=>{
    try {
        res.render('users/login');
    } catch (error) {
        console.log(error.message);
    }
 }
 const verifylogin = async(req,res,next)=>{
    try {
        console.log(req.body);
        const email = req.body.email ;
        const password = req.body.password ;
        const userdata = await UserModel.findOne({Email:email})
        if(userdata){
            const passwordMatch = await bcrypt.compare(password,userdata.Password);
            if(passwordMatch){
                if( userdata.is_verified === 0){
                    res.render('users/login',{message:'please verify email '}) 
                }else{
                    req.session.user_id = userdata._id
                    console.log( req.session.user_id);
                    
                    res.redirect('/')
                }
            }
            else{
                res.render('users/login',{message:'Invaild password or email '})
            }
        }else{
            res.render('users/login',{message:'Invaild password or email '})
        }
    } catch (error) {
        console.log(error.message);
    }
 }
 // for logout 
 const Userlogout = (req,res,next)=>{
    try {
        req.session.user_id =null;
       
        res.redirect('/login');
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
            html:'<p>Hii '+name+' please click  here to <a href ="http://localhost:3000/forget_password/'+token+'">Reset</a> your Password </p> '
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

 // for forgot password 
 const loadforgetform = (req,res,next)=>{
    try {
        res.render('users/forget')
    } catch (error) {
        console.log(error.message);
    }
 }
 const VerifyForget = async(req,res,next)=>{
    try {
       const email =  req.body.email;
       const userdata = await UserModel.findOne({Email:email});
       if(userdata){
        if(userdata.is_verified === 0){
            res.render('users/forget',{message:'Please verify your mail'})
            
        }else{
            const randomstring =randomString.generate();
            const updateddata =await UserModel.updateOne({Email:email},{
                $set:{
                    token:randomstring
                }
            })
            sendresetVerify(userdata.name,userdata.Email,randomstring);
            res.render('users/forget',{message:'Please check your mail to Reset password'})
        }
       }else{
        res.render('users/forget',{message:'Invaild User Email'})
       }
    } catch (error) {
        console.log(error.message);
    }
 }
 // for  load forget password
 const loadforgetpassword =async(req,res,next)=>{
    try {
        token_id = req.params.id
        console.log(token_id);
        const tokendata = await UserModel.findOne({token:token_id})
        console.log(tokendata);
        if(tokendata){
            res.render('users/forget_password',{user_id:tokendata._id,title:'Reset Password'});
        }else{
            res.render('users/404',{message:'invaild token'})
        }
        
        
    } catch (error) {
        console.log(error.message);
    }
 }
 const Updateforgetpassword = async(req,res,next)=>{
    try {
        console.log(req.params.id);
        const resetpassword = await bcrypt.hash(req.body.password,10);
         const user_id=req.body.user_id
        const Updatedpassword = await UserModel.findByIdAndUpdate({_id:user_id},{
            $set:{
                Password:resetpassword,
                token:''
            }
        })
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
 }
 module.exports = {
    Usersignup,
    addtoMongUsersignup,
    verify,
    loadlogin,
    verifylogin,
    Userlogout,
    loadforgetform,
    VerifyForget,
    loadforgetpassword,
    Updateforgetpassword
 }