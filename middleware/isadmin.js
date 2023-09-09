const is_Login = (req,res,next)=>{
    try {
        if(req.session.admin_id){
            console.log(req.session.admin_id);
        }else{
            res.redirect('/admin/login')
        }
        next();
    } catch (error) {
       console.log(error.message); 
    }
 }
  const is_Logout = (req,res,next)=>{
    try {
        if(req.session.admin_id){
            res.redirect('/admin/')
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
 }
 module.exports = {
    is_Login,
    is_Logout
 }