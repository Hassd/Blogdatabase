const mongoose=require('./db');
let Schema=mongoose.Schema; 

let admin_schema =new Schema({  
    adminid:String,
    password:String
});
let admin_Model = mongoose.model("admin",admin_schema,"admin");
   

module.exports = admin_Model;
