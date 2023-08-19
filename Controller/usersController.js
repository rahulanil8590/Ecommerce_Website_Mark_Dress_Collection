const BannerModel = require('../models/BannerModel');
const SliderModel = require('../models/SliderModel');

const LoadHome = async(req, res, next) => {
    try {
        const SliderDetails =  await SliderModel.find({}).lean();
        const Banner =  await BannerModel.find({}).lean()
        res.render('users/Userhome',{SliderData:SliderDetails,Banner:Banner,title:'Home'})
        

    } catch (error) {
        console.log(error.message);
    }
}
 
module.exports ={
   LoadHome,
   
    
}