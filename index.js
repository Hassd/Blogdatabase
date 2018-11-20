const fs=require('fs');
const router=require('./router');
const admin_Model=require('./library/admin');
const user_Model=require('./library/user');
const type_Model=require('./library/type');
const article_Model=require('./library/article');
const comment_Model=require('./library/comment');
const reply_Model=require('./library/reply');

//后台登录的账号密码查询
router.post('/admin',async(ctx)=>{
    let data=ctx.request.body;
    await admin_Model.findOne(data,(err,data)=>{
      if(err) return console.log(err);
      ctx.body=data;
    })
})

//前台评论用户登录
router.post('/user',async(ctx)=>{
    let data=ctx.request.body;
    let i= await user_Model.findOne({userid:data.userid});
    if(i==null){
        let addtype=new user_Model(data);
        await addtype.save().then((err,data)=>{
            if(err) console.log(err)
            ctx.body=data;
        })
    }else{
        await user_Model.findOne(data,(err,data)=>{
            if(err) console.log(err)
            if(data==null){
                ctx.body={
                    state:0
                }
            }else{
                ctx.body={
                    state:1
                }
            }
        })
    }
})






//插入一条新类型
router.get('/typeadd',async(ctx)=>{
    let data=ctx.query;
    let addtype=new type_Model(data);
    await addtype.save().then(()=>{
        ctx.body={
            state:'插入数据成功！'
        };
    })
})

//修改一条类型数据
router.get('/typeup',async(ctx)=>{
    let data=ctx.query;
    let typeid={
        _id:data._id
    }
    let typeup={
        typename:data.typename,
        typeclass:data.typeclass,
        typeintr:data.typeintr
    }
    await type_Model.updateOne(typeid,typeup,(err,data)=>{
        if(err) return console.log(err) 
        ctx.body=data;
    })
})

//查询类型全部
router.get('/typeallfind',async(ctx)=>{
    await type_Model.find((err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//查询类型总数
router.get('/typeallnum',async(ctx)=>{
    let data=ctx.query;
    let datafind={
        typename:{$regex:data.typename},
        typeclass:{$regex:data.typeclass}
    }
    await type_Model.countDocuments(datafind,(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//查询类型某处到某处的10个数据
router.get('/typeallskip',async(ctx)=>{
    let data=ctx.query;
    let num=parseInt(data.num);
    let datafind={
            typename:{$regex:data.typename},
            typeclass:{$regex:data.typeclass}
    }
    let i= await type_Model.find(datafind).sort({_id: -1}).limit(10).skip(num*10);
    ctx.body=i;
})

//查询一条类型
router.get('/typeOne',async(ctx)=>{
    let data=ctx.query;
    await type_Model.findOne(data,(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//删除一条类型数据
router.get('/typedelete',async(ctx)=>{
    let data=ctx.query;
    await type_Model.deleteOne(data,(err,data)=>{
        if(err) return console.log(err) 
        ctx.body=data;
    })
})







//增加一条文章数据
router.post('/articleadd',async(ctx)=>{
    let data=ctx.request.body;
    let date=new Date();

    let articleroute='./folder/'+date.getTime()+'.txt';
    await fs.writeFile(articleroute,data.content,function(err){
        if(err) console.log(err)
    })

    let mydata={
        title:data.title,
        type:data.type,
        introduce:data.introduce,
        articleroute:articleroute,
        srcimg:data.srcimg,
        time:date.toLocaleDateString(),
        click:0
    }

    let addarticle=new article_Model(mydata);
    await addarticle.save().then(()=>{
        ctx.body={
            state:'插入数据成功！'
        };
    })
})

//  后台  查询文章某处到某处的10个数据
router.post('/articleallskip',async(ctx)=>{
    let data=ctx.request.body;
    let num=parseInt(data.num);
    let datafind={
        title:{$regex:data.title},
        time:{$regex:data.time},
        type:{$regex:data.type}
    }
    let i= await article_Model.find(datafind).sort({_id: -1}).sort({_id: -1}).limit(10).skip(num*10);
    ctx.body=i;
})

//  后台  查询文章总数
router.get('/articleallnum',async(ctx)=>{
    let data=ctx.query;
    let datafind={
        title:{$regex:data.title},
        time:{$regex:data.time},
        type:{$regex:data.type}
    }
    await article_Model.countDocuments(datafind,(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//  前台  查询文章某处到某处的10个数据
router.post('/qianarticleallskip',async(ctx)=>{
    let data=ctx.request.body;
    let num=parseInt(data.num);
    let arr=[];
    let q= await type_Model.find({typeclass:{$regex:data.typeclass}},['typename']);
    for(let i=0;i<q.length;i++){
        arr[i]=q[i].typename;
    }
    let j= await article_Model.find({type:arr}).sort({_id: -1}).limit(10).skip(num*10);
    ctx.body=j;
})

//  前台  查询文章总数
router.get('/qianarticleallnum',async(ctx)=>{
    let data=ctx.query;
    let arr=[];
    let q= await type_Model.find({typeclass:{$regex:data.typeclass}},['typename']);
    for(let i=0;i<q.length;i++){
        arr[i]=q[i].typename;
    }
    await article_Model.countDocuments({type:arr},(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//  前台2  查询文章某处到某处的10个数据
router.post('/qianarticleallskip2',async(ctx)=>{
    let data=ctx.request.body;
    let num=parseInt(data.num);
    let mydata={
           type:{$regex:data.typename},
           title:{$regex:data.title}
    }
    let j= await article_Model.find(mydata).sort({_id: -1}).limit(10).skip(num*10);
    ctx.body=j;
})

//  前台2  查询文章总数
router.get('/qianarticleallnum2',async(ctx)=>{
    let data=ctx.query;
    let mydata={
        type:{$regex:data.typename},
        title:{$regex:data.title}
    }  
    await article_Model.countDocuments(mydata,(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//查询一条文章数据
router.post('/articlefindone',async(ctx)=>{
    let data=ctx.request.body;
    let mydata='';
    await article_Model.findOne(data,(err,data)=>{
        if(err) return console.log(err) 
        let articleroute=fs.readFileSync(data.articleroute,'utf-8');
        mydata={
            _id:data._id,
            title:data.title,
            type:data.type,
            time:data.time,
            introduce:data.introduce,
            click:data.click,
            srcimg:data.srcimg,
            content:articleroute,
            articleroute:data.articleroute
        }
    })
    .then(()=>{
        ctx.body=mydata;
    })
})

//删除一条文章数据
router.get('/articledelete',async(ctx)=>{
    let data=ctx.query;

    let i= await comment_Model.find({articleid:data._id});
    for(let q=0;q<i.length;q++){
        await reply_Model.deleteMany({commentid:i[q]._id});
    }

    await fs.unlinkSync(data.articleroute,(err)=>{
        if(err) console.log(err)
    })
    if(data.srcimg){
        await fs.unlinkSync(data.srcimg,(err)=>{
            if(err) console.log(err)
        })
    }
    await comment_Model.deleteMany({articleid:data._id});
    await article_Model.deleteOne({_id:data._id},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            ctx.body=data;
        }
    })
})

//修改一条文章数据
router.post('/articleup',async(ctx)=>{
    let data=ctx.request.body;
    let articleid={
        _id:data._id
    }
    let articleup={
        title:data.title,
        type:data.type,
        srcimg:data.srcimg,
        introduce:data.introduce,
    }
    await fs.writeFile(data.articleroute,data.content,function(err){
        if(err) console.log(err)
    })
    await article_Model.updateOne(articleid,articleup,(err,data)=>{
        if(err) return console.log(err) 
        ctx.body=data;
    })
})





//删除一条评论数据
router.get('/commentdelete',async(ctx)=>{
    let data=ctx.query;
    await reply_Model.deleteMany({commentid:data._id});
    await comment_Model.deleteOne(data,(err,data)=>{
        if(err) return console.log(err)
        ctx.body={
            state:'成功'
        };
    })
})

//插入一条新评论
router.get('/commentadd',async(ctx)=>{
    let data=ctx.query;
    let date=new Date();
    let mydata={
        articleid:data.articleid,
        userid:data.userid,
        time:date.toLocaleDateString(),
        comment:data.comment
    }
    let addcomment=new comment_Model(mydata);
    await addcomment.save().then(()=>{
        ctx.body={
            state:'插入成功！'
        };
    })
})

//  后台  查询评论
router.get('/commentfind',async(ctx)=>{
    let data=ctx.query;
    let num=parseInt(data.num);
    let i= await comment_Model.find({comment:{$regex:data.comment}}).sort({_id: -1}).limit(10).skip(num*10);
    for(let j=0;j<i.length;j++){
        let a={};
        a['_id']=i[j]._id+"";
        a['articleid']=i[j].articleid;
        a['userid']=i[j].userid;
        a['time']=i[j].time;
        a['comment']=i[j].comment;
        let q= await article_Model.findOne({_id:i[j].articleid});
        a['title']=q.title;
        i[j]=a;
    }   
    ctx.body=i;
})

//  后台  查询评论总数
router.get('/commentnum',async(ctx)=>{
    let data=ctx.query;
    await comment_Model.countDocuments({comment:{$regex:data.comment}},(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//  前台  按articleid查询评论
router.get('/commentarticleidfind',async(ctx)=>{
    let data=ctx.query;
    let qwe;
    let arr=[];
    let qq= await comment_Model.find(data);
    for(let i=0;i<qq.length;i++){
        qwe=await reply_Model.find({commentid:qq[i]._id});
        arr[i]={"comment":qq[i],"reply":qwe}
    }
    ctx.body=arr;
})





//  后台  查询回复
router.get('/replyfind',async(ctx)=>{
    let data=ctx.query;
    let num=parseInt(data.num);
    let i= await reply_Model.find({comment:{$regex:data.comment}}).sort({_id: -1}).limit(10).skip(num*10);
    let q='';
    for(let j=0;j<i.length;j++){
        let a={};
        a['_id']=i[j]._id+"";
        a['commentid']=i[j].commentid;
        a['userid']=i[j].userid;
        a['comment']=i[j].comment;
        a['time']=i[j].time;
        q= await comment_Model.findOne({_id:i[j].commentid});
        a['commenttext']=q.comment;
        i[j]=a;
    }
    ctx.body=i;
})

//  后台  查询回复总数
router.get('/replynum',async(ctx)=>{
    let data=ctx.query;
    await reply_Model.countDocuments({comment:{$regex:data.comment}},(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//插入一条新回复
router.get('/replyadd',async(ctx)=>{
    let data=ctx.query;
    let date=new Date();
    let mydata={
        commentid:data.commentid,
        userid:data.userid,
        comment:data.comment,
        time:date.toLocaleDateString()
    }
    let addreply=new reply_Model(mydata);
    await addreply.save().then(()=>{
        ctx.body={
            state:'插入成功！'
        };
    })
})

//删除一条回复数据
router.get('/replydelete',async(ctx)=>{
    let data=ctx.query;
    await reply_Model.deleteOne(data,(err,data)=>{
        if(err) return console.log(err) 
        ctx.body={
            state:'成功'
        };
    })
})





//查询用户表
router.get('/userfind',async(ctx)=>{
    let data=ctx.query;
    let num=parseInt(data.num);
    let i= await user_Model.find({userid:{$regex:data.userid}}).sort({_id: -1}).limit(10).skip(num*10);
    ctx.body=i;
})

//查询用户总数
router.get('/usernum',async(ctx)=>{
    let data=ctx.query;
    await user_Model.countDocuments({userid:{$regex:data.userid}},(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//删除一条用户数据
router.get('/userdelete',async(ctx)=>{
    let data=ctx.query;
    await user_Model.deleteOne(data,(err,data)=>{
        if(err) return console.log(err) 
        ctx.body={
            state:'成功'
        }
    })
})




//点击数加一
router.get('/articleclick',async(ctx)=>{
    let data=ctx.query;
    await article_Model.updateOne(data,{$inc:{click:1} } ,(err,data)=>{
        if(err) return console.log(err)
        ctx.body=data;
    })
})

//公告
router.get('/notice',async(ctx)=>{
    let i=await article_Model.find().sort({'click':-1}).limit(5);
    let j=await article_Model.find().sort({'time':-1}).limit(5);
    ctx.body={
        notice1:i,
        notice2:j
    }
})

