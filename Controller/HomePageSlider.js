const { default: mongoose } = require('mongoose');
const SliderModel = require('../models/SliderModel') // Adjust the path accordingly to your Slider model
const Slider_multer = require('../multer/Slider_multer');// Adjust the destination folder as needed to Slider
const { response } = require('express');
// Add slider
let Slider = (req,res,next) =>{
   
    try{
        
        res.render('admin/add_slider')
    }catch(error){
        console.log(error.message);
    }
}
const addSliderImageSavingFile = Slider_multer.single('ImageFile');

const addSlider = async (req, res, next) => {
    try {
        console.log(req.body);

        // Create a new Slider instance
        const newSlider = new SliderModel({
            Sub_header: req.body.subHeader, // Adjust this to match your model schema
            Main_header: req.body.mainHeader,
            Image_url: req.file.filename // Assuming you store the image path in your model
        });

        // Save the Slider to the database
        await newSlider.save();

        res.redirect('/admin/add_slider');
    } catch (error) {
        console.log(error.message);
        // Handle the error appropriately
    }
};
// Display Slider Table
 const DisplaySlider = async(req,res,next)=>{
    try{
        SliderModel.find({})
        .lean()
        .then(data =>{
            res.render('admin/Slider_details',{data,title:'Display Slider'})
        }).catch(error =>{
            console.log(error.message);
                res.status(500).send('Error Message Come Get Slider Data.');
        })

    }catch(error){
        console.log(error.message);
    }
 }
 // Edit Slider 
  const EditSlider = async(req,res)=>{
    try{
        console.log(req.params.id);
        let Slider = await SliderModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean();
        console.log(Slider);
        res.render('admin/Edit_Slider',{ Slider,title:'Edit_Slider'});
        
       
    }catch(error){
        console.log(error.message);
    }
  }
  const EditedSlider = async(req,res,next)=>{
    try{
        console.log(req.params.id);
        if(req.file){  // check new image or Mongodb stored image
            image = req.file.filename

        }else{
            let SliderImage = SliderModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)})
            image = SliderImage.Image_url;
        }
         await SliderModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{ // Update the Slider data
            Sub_header: req.body.subHeader, 
            Main_header: req.body.mainHeader,
            Image_url: image
        }).then(response =>{
            res.redirect('/admin/display_slider')

        }).catch(error=>{
            console.log(error.message);
                res.status(500).send('Error Message Come to  Slider Updating.');
        })
      
    }catch(error){
        console.log(error.message);
    }
  }
 // Delete Slider
  const  deleteSlider = (req,res,next)=>{
    try{
        console.log(req.params.id);
       SliderModel.findOneAndRemove({_id: new mongoose.Types.ObjectId(req.params.id)})
      .then(response =>{
        console.log('Succesful deleted');
        res.redirect('/admin/display_slider')
      }).catch(error =>{
        console.log(error.message);
                res.status(500).send('Error Message Come to  Slider Deleting.');
      })

    }catch(error){
        console.log(error.message);
    }
  }
module.exports ={
    Slider ,
    addSliderImageSavingFile,
    addSlider,
    DisplaySlider,
    EditSlider,
    EditedSlider,
    deleteSlider,
}