const mongoose=require('./db');
let Schema=mongoose.Schema; 

let reply_schema =new Schema({  
    commentid:String,
    userid:String,
    time:String,
    comment:String
});
let reply_Model = mongoose.model("reply",reply_schema,"reply");
   

module.exports = reply_Model;
