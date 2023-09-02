const mongoose = require('mongoose');
const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    is_admin:{
        type:Number,
        require:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    }
});
const UserModel = mongoose.model('usermodel',UserSchema);
module.exports = UserModel