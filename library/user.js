const mongoose=require('./db');
let Schema=mongoose.Schema; 

let user_schema =new Schema({  
    userid:String,
    password:String
});
let user_Model = mongoose.model("user",user_schema,"user");
   

module.exports = user_Model;
