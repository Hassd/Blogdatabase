const mongoose=require('./db');
let Schema=mongoose.Schema;

let type_schema =new Schema({  
    typename:String,
    typeclass:String,
    typeintr:String
});
let type_Model = mongoose.model("type",type_schema,"type");
   

module.exports = type_Model;
