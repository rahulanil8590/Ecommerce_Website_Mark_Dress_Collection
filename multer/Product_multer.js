const multer=require('multer');
const path =require('path')
const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images/Product_image')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
 let Product_image = multer({ storage: storage });

module.exports = Product_image;