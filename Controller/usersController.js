const SliderModel = require('../models/SliderModel');

const GetSlider = (req, res, next) => {
    try {
        SliderModel.find({})
            .lean()
            .then(data => {
                res.render('users/Slider', { data, title: 'Home' })
            })
            .catch(error => {
                console.log(error.message);
                res.status(500).send('Error uploading file.');
            })

    } catch (error) {
        console.log(error.message);
    }
}
module.exports ={
    GetSlider
}