const mongoose =require('mongoose');
// Parent Category Creating
 const ReviewSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    color:{
        type:String
    },
    icon:{
        type:String
    }
 });
 const CategoryModel = mongoose.model('category',CategorySchema);
 module.exports=CategoryModel