const AboutModel = require('../models/AboutModel');
const About_multer = require('../multer/About_multter');// for the blog page  blog image storing in mongodb
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const UserCart = require('../models/UserCart');
const CategoryModel = require('../models/CategoryModel');


const LoadAboutFormPage = (req,res,next) =>{
    try{
        res.render('admin/add_about');
    }catch(error){
        console.log(error.message);
    }
  }
  const addAboutImageSavingFile = About_multer.array('AboutImages',2);
  const Inset_About_Data = async(req,res,next)=>{
    
    try{
        // for  insert the images and Array
        const imagearray = [];
        for(file of req.files){
            imagearray.push(file.filename)
        }
       // Create a new Banner instance
       console.log(req.body);
       const newAbout = new AboutModel({
       title1: req.body.title1,
       title2: req.body.title2, 
       Para1: req.body.para1,
       para2: req.body.para2,
       para3: req.body.para3,
       para4: req.body.para4,
       images: imagearray,
       Thought:req.body.Thought,
       
    });

    // Save the Slider to the database
    await newAbout.save();

    res.redirect('/admin/add_about');
    }catch(error){
        console.log(error.message);
    }
  }
  //Diplay the Detailed Table of Blog
  const Load_Display_About= async(req,res,next) =>{
    try{
     const Aboutdata = await AboutModel.find({}).lean();
        res.render('admin/load_About_details',{Data:Aboutdata,title:'About'});
       
    }catch(error){
        console.log(error.message);
    }
  }
// Editing the About Section
const editAbout = async(req,res,next) =>{
    try{
        let Aboutdata = await AboutModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean();
        console.log(Aboutdata);
        res.render('admin/Edit_About',{Aboutdata,title:'Edit_Blog'});

    }catch(error){

        console.log(error.message);
    }

  }
  // Update the Blog Section
  const UpdateAbout = async(req,res,next)=>{
    try{
        if(req.file){
            const imagearray = [];
            for(file of req.files){
                imagearray.push(file.filename)
            }
            image = imagearray;
            console.log(image);
        }else{
           
           let AboutImages = await AboutModel.findOne({_id: new mongoose.Types.ObjectId(req.params.id)});
          
           image = AboutImages.images;
           console.log(image);
        }
        
        console.log(req.params.id);   
        console.log(req.body); 
      AboutModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{
       title1: req.body.title1,
       title2: req.body.title2, 
       Para1: req.body.para1,
       para2: req.body.para2,
       para3: req.body.para3,
       para4: req.body.para4,
       images:image,
       Thought:req.body.Thought,

        }).then(response =>{
            res.redirect('/admin/View_about')
        }).catch(error =>{
            console.log(error.message);
            res.status(500).send('Error Message Come to update Banner Will be failed.');
            
        })
       
    }catch(error){
        console.log(error.message);

    }
  }
  // for Delete the blog
  const DeleteAbout = async(req,res,next)=>{
    try{
        await AboutModel.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)})
        res.redirect('/admin/View_about')

    }catch(error){
        console.log(error.message);
    }
  }
  const LoadAbout =  async(req,res,next)=>{
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
       
         // for fetching the all data of Blog Model 
         const Aboutdata = await AboutModel.find({}).lean()
         
    

    

// for Details pass the  render  Blog ejs file
         res.render('users/about',
        {
        title:'About',
         User:UserId,
         cartcount,
         CartItems:CartItem,
         Data:Aboutdata,
         
        });

    } catch (error) {
        console.log(error.message);
    }
  }

 module.exports ={
    LoadAboutFormPage,
    addAboutImageSavingFile,
    Inset_About_Data,
    Load_Display_About,
    editAbout,
    UpdateAbout,
    DeleteAbout,
    LoadAbout
   
 }