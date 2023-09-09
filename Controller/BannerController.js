const { default: mongoose } = require('mongoose');
const BannerModel = require('../models/BannerModel')// Adjust the path accordingly to your Banner model
const Banner_multer =require('../multer/Banner_multer');// Adjust the destination folder as needed to Banner
const { response } = require('express');
const CategoryModel = require('../models/CategoryModel');

//-----Banner-------//
// Render the Form of Adding Banner Data
const addBanner = async(req,res,next) =>{
    try{
        const isadmin =  req.session.admin_id;
        const Category = await CategoryModel.find({}).lean();
        res.render('admin/load_add_Banner',{Category,title:'Banner',Isadmin:isadmin})
    }catch(error){
        console.log(error.message);
    }
  }
  // Saving Image into Banner Folder
  const addBannerImageSavingFile = Banner_multer.single('ImageFile');
  // Adding Banner Date in Mongodb
  const add_to_mongodb = async(req,res,next)=>{
    
    try{
        const isadmin =  req.session.admin_id;
       // Create a new Banner instance
       const newBanner = new BannerModel({
        Sub_header: req.body.subHeader, // Adjust this to match your model schema
        Main_header: req.body.mainHeader,
        Image_url: req.file.filename,// Assuming you store the image path in your model
        Category:req.body.category
    });

    // Save the Slider to the database
    await newBanner.save();

    res.redirect('/admin/add_Banner');
    }catch(error){
        console.log(error.message);
    }
  }
  //Diplay the Detailed Table of Banner
  const Load_Display_Banner = async(req,res,next) =>{
    try{
        const isadmin =  req.session.admin_id; 
     const Banner = await BannerModel.find({}).lean();
        res.render('admin/load_Banner_details',{Data:Banner,title:'Banner',Isadmin:isadmin});
       
    }catch(error){
        console.log(error.message);
    }
  }
  // Editing the Banner Section
  const editBanner = async(req,res,next) =>{
    const isadmin =  req.session.admin_id;
    try{
        let Banner = await BannerModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean();
        console.log(Banner);
        res.render('admin/Edit_banner',{Banner,title:'Edit_Banner',Isadmin:isadmin});

    }catch(error){

        console.log(error.message);
    }

  }
  // Update the Banner Section
  const UpdateBanner = async(req,res,next)=>{
    const isadmin =  req.session.admin_id;
    try{
        if(req.file){
            image = req.file.filename
        }else{
            console.log('image');
           let BannerImage = await BannerModel.findOne({_id: new mongoose.Types.ObjectId(req.params.id)});
           image = BannerImage.Image_url;
        }
        console.log(req.body);
        BannerModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{
           Sub_header:req.body.subHeader, 
           Main_header: req.body.mainHeader,
           Image_url:image

        }).then(response =>{
            res.redirect('/admin/display_Banner')
        }).catch(error =>{
            console.log(error.message);
            res.status(500).send('Error Message Come to update Banner Will be failed.');
            
        })
       
    }catch(error){
        console.log(error.message);

    }
  }
  const DeleteBanner = async(req,res,next)=>{
    try{
        await BannerModel.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)})
        res.redirect('/admin/display_Banner')

    }catch(error){
        console.log(error.message);
    }
  }

module.exports ={
    addBanner,
    Load_Display_Banner,
    add_to_mongodb,
    addBannerImageSavingFile,
    editBanner,
    UpdateBanner,
    DeleteBanner

}