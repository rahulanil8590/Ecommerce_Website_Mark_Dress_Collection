const SliderModel = require('../models/SliderModel') // Adjust the path accordingly to your Slider model
const Slider_multer = require('../multer/Slider_multer');// Adjust the destination folder as needed
// Add slider
let Slider = (req,res,next) =>{
   
    try{
        
        res.render('admin/add_slider')
    }catch(error){
        console.log(error.message);
    }
}
const addSliderToMongodb = Slider_multer.single('ImageFile');

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

module.exports ={
    Slider ,
    addSliderToMongodb,
    addSlider
}