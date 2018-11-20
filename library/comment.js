const mongoose=require('./db');
let Schema=mongoose.Schema; 

let comment_schema =new Schema({  
    articleid:String,
    userid:String,
    time:String,
    comment:String
});
let comment_Model = mongoose.model("comment",comment_schema,"comment");
   

module.exports = comment_Model;
