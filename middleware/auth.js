  const is_Login = (req,res,next)=>{
    try {
        if(req.session.user_id){
            console.log(req.session.user_id);
        }else{
            res.redirect('/login')
        }
        next();
    } catch (error) {
       console.log(error.message); 
    }
 }
  const is_Logout = (req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/')
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