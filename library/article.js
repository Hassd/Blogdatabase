const mongoose=require('./db');
let Schema=mongoose.Schema; 

let article_schema =new Schema({  
    title:String,
    type:String,
    introduce:String,
    articleroute:String,
    srcimg:String,
    time:String,
    click:Number
});
let article_Model = mongoose.model("article",article_schema,"article");
   

module.exports = article_Model;
