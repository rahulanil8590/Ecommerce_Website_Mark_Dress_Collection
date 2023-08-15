const mongoose = require('mongoose');
let state={
    db:null
}
module.exports.connect=(done)=>{
 url =`mongodb://127.0.0.1:27017/EcommerceWebsite`;

mongoose.connect(url,).then((data)=>{
    console.log("Connected successfully");
   state.db=data
    
    done()
}).catch((err)=> console.log('connection error'))
       
}
module.exports.get = function(){
    return state.db
}