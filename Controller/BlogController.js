const BlogModel = require('../models/BlogModel');
const Blog_multer = require('../multer/blog_Multer');// for the blog page  blog image storing in mongodb
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const UserCart = require('../models/UserCart');
const CategoryModel = require('../models/CategoryModel');

const LoadBlogFormPage = (req,res,next) =>{
    try{
        res.render('admin/add_blog');
    }catch(error){
        console.log(error.message);
    }
  }
 
  const addBlogImageSavingFile = Blog_multer.single('BlogImageFile');
  const Inset_Blog_Data = async(req,res,next)=>{
    
    try{
       // Create a new Banner instance
       console.log(req.body);
       const newBlog = new BlogModel({
        Title: req.body.title, 
        description: req.body.description,
        richDescription:req.body.richdescription,
        Blog_image: req.file.filename 
    });

    // Save the Slider to the database
    await newBlog.save();

    res.redirect('/admin/add_blog');
    }catch(error){
        console.log(error.message);
    }
  }
  //Diplay the Detailed Table of Blog
  const Load_Display_Blog= async(req,res,next) =>{
    try{
     const Blogdata = await BlogModel.find({}).lean();
        res.render('admin/load_Blog_details',{Data:Blogdata,title:'BLog'});
       
    }catch(error){
        console.log(error.message);
    }
  }
  // Editing the Banner Section
  const editBlog = async(req,res,next) =>{
    try{
        let Blog = await BlogModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean();
        console.log(Blog);
        res.render('admin/Edit_blog',{Blog,title:'Edit_Blog'});

    }catch(error){

        console.log(error.message);
    }

  }
   // Update the Blog Section
   const UpdateBlog = async(req,res,next)=>{
    try{
        if(req.file){
             image = req.file.filename
        }else{
            console.log('image');
           let BlogImage = await BlogModel.findOne({_id: new mongoose.Types.ObjectId(req.params.id)});
           image = BlogImage.Blog_image;
        }
        console.log(req.body);
        BlogModel.updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{
            Title: req.body.title, 
            description: req.body.description,
            richDescription:req.body.richdescription,
            Blog_image: image 

        }).then(response =>{
            res.redirect('/admin/View_Blog')
        }).catch(error =>{
            console.log(error.message);
            res.status(500).send('Error Message Come to update Banner Will be failed.');
            
        })
       
    }catch(error){
        console.log(error.message);

    }
  }
  // for Delete the blog
  const DeleteBlog = async(req,res,next)=>{
    try{
        await BlogModel.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)})
        res.redirect('/admin/display_Banner')

    }catch(error){
        console.log(error.message);
    }
  }
  // for User Side to load the blog page
  const LoadBlog =  async(req,res,next)=>{
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
         const Blogdata = await BlogModel.find({}).lean()
         
     // for Month to letter type model 
    function getMonthName(month) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month];
    }

    const FeaturedProduct = await ProductModel.find({isFeatured:'true'})
    console.log(FeaturedProduct);
      // For Fetch The Category
      const Category = await CategoryModel.find({}).select('name ');
      console.log(Category);

// for Details pass the  render  Blog ejs file
         res.render('users/Blog',
        {
        title:'Blog',
         User:UserId,
         cartcount,
         CartItems:CartItem,
         Data:Blogdata,
         getMonthName: getMonthName,
         FeaturedProducts:FeaturedProduct,
         Categorys:Category
        });

    } catch (error) {
        console.log(error.message);
    }
  }
  // for Fetch Blog To Detailed  Page
   const LoadBlogdetailed = async(req,res,next) =>{
    try{
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
         const Blogdata = await BlogModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)}).lean()
         console.log(Blogdata);
     // for Month to letter type model 
    function getMonthName(month) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month];
    }

    const FeaturedProduct = await ProductModel.find({isFeatured:'true'})
    console.log(FeaturedProduct);
    // For Fetch The Category
    const Category = await CategoryModel.find({}).select('name ');
    console.log(Category);

// for Details pass the  render  Blog ejs file
         res.render('users/Blog_detail',
        {
        title:'Blog_detail',
         User:UserId,
         cartcount,
         CartItems:CartItem,
         Data:Blogdata,
         getMonthName: getMonthName,
         FeaturedProducts:FeaturedProduct,
         Categorys:Category
        });

       
    }catch(error){
        console.log(error.message);
    }
  }
module.exports ={
    LoadBlogFormPage,
    addBlogImageSavingFile,
    Inset_Blog_Data,
    Load_Display_Blog,
    editBlog,
    UpdateBlog,
    DeleteBlog,
    LoadBlog,
    LoadBlogdetailed
}