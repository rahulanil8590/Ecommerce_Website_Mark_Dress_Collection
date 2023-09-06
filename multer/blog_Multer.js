const multer=require('multer');
const path =require('path')
const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images/Blog/blog_image')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
 let  Slider_multer = multer({ storage: storage });

module.exports = Slider_multer;