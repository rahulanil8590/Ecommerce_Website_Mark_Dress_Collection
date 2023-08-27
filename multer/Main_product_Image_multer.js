const multer=require('multer');
const path =require('path')

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images/Main_Product_Image')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
    
})

 let Main_Product_image = multer({ storage: storage });

module.exports =Main_Product_image;