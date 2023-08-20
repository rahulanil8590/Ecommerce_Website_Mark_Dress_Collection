const CategoryModel = require('../models/CategoryModel');
const mongoose = require('mongoose')

const InsertCategory = (req,res,next)=>{
  try {
    res.render('admin/Insert_Category',{title:'Category'})
  } catch (error) {
    console.log(error.message);
  }
};
const Insert_Cat_to_mon_db = async( req,res,next)=>{
    try {
        console.log(req.body);
        const Categor_Data =  await CategoryModel.find({})
        console.log(Categor_Data);
        if(Categor_Data.length >0){ // when checking the mongodb is empty or not empty
            let checking=false
            for(i=0;i<Categor_Data.length;i++){ // when checking name is coming same or not 
                if(Categor_Data[i]['name'].toLowerCase()=== req.body.name.toLowerCase()){
                    checking=true;
                    break;
                    
                }
            }
            if(checking == false){
                const Category = new  CategoryModel({
                    name:req.body.name,
                    color:req.body.color,
                    icon:req.body.icon
                })
               const cat_data =  await Category.save() 
               res.redirect('/admin/add_Category')
            }else{
                res.status(500).send('Error Message come Category already exits.');
            }

        }else{
            const Category = new  CategoryModel({
                name:req.body.name,
                color:req.body.color,
                icon:req.body.icon
            })
           const cat_data =  await Category.save() 
           res.redirect('/admin/add_Category')
        }

       
        
    } catch (error) {
        console.log(error.message);
    }
}
// -----View Categories----//
const View_Categories = (req,res,next)=>{
    try {
        CategoryModel.find({})
        .lean()
        .then(data =>{
            res.render('admin/View_Category',{data,title:' View_Category'})
        }).catch(error=>{
            console.log(error);
            res.status(500).send('Error Message come  View Category ');
        })
    } catch (error) {
        console.log(error);
    }
}
// EditCategory 
const EditCategory = async(req,res)=>{
    try{
        console.log(req.params.id);
        let Category = await CategoryModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean();
        console.log(Category);
        res.render('admin/Edit_Category',{ Category,title:'Edit_Slider'});
        
       
    }catch(error){
        console.log(error.message);
    }
  }
  const UpdateCategory = async(req,res,next)=>{
    try{
        
         await CategoryModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{ // Update the Slider data
           name: req.body.name, 
            color: req.body.color,
           icon:req.body.icon,
        }).then(response =>{
            res.redirect('/admin/View_Category')

        }).catch(error=>{
            console.log(error.message);
                res.status(500).send('Error Message Come to  Category Updating.');
        })
      
    }catch(error){
        console.log(error.message);
    }
  }

  const DeleteCategory = async(req,res,next)=>{
    try {
        await CategoryModel.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)})
        res.redirect('/admin/add_Category')
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports ={
    InsertCategory,
    Insert_Cat_to_mon_db,
    View_Categories,
    EditCategory,
    UpdateCategory,
    DeleteCategory
}