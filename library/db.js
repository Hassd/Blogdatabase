const mongoose=require('mongoose'); //mongodb数据库中间件

mongoose.connect('mongodb://localhost/hassd',{ useNewUrlParser: true });    //连接数据库

mongoose.connection.on('open',()=>{
    console.log('开启数据库成功！');
});        //连接成功后

mongoose.connection.on('error',(err)=>{ 
    console.log('Mongoose connection error: ' + err);
});  //连接失败后

module.exports = mongoose;