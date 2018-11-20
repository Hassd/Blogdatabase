const Koa=require('koa');
const path = require('path');   //node 自带路径
const bodyParser = require('koa-bodyparser');   //post 获取值
const Router = require('koa-router');   //koa路由
const static = require('koa-static');   //静态资源
const cors = require('koa2-cors');  //答跨域请求

const multer=require('koa-multer'); //文件上传

let app=new Koa();
let router = new Router();

app.use(bodyParser());  //加入 post
app.use(static(path.join(__dirname,'./static')));
app.use(cors({
    origin:(ctx)=>{
      if (ctx.url === '/test') {
        return false;
      }
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './static/')
  },
  filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

var upload = multer({ storage: storage });
router.post('/img',upload.single('file'),async(ctx)=>{
  ctx.body={
      filename:ctx.req.file.filename
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000,()=>{
    console.log('服务开启！');
});

module.exports = router;