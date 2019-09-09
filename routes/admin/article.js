const router = require('koa-router')();
const DB = require('../../model/db');
const tools = require('../../model/tools');
const multer = require('koa-multer');
//上传文件的相关配置
var storage = multer.diskStorage({
    //文件保存路径
    destination:function(req,file,cb){
        cb(null,'public/uploads/')
    },
    //修改文件名称
    filename:function(req,file,cb){
        var fileFormat = (file.originalname).split('.');
        //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now()+'.'+fileFormat[fileFormat.length - 1]);
    }
});
//加载配置
var upload = multer({storage:storage});

//渲染内容列表页面
router.get('/',async(ctx,next)=>{
    let page = ctx.query.page || 1;
    let pageSize = 5;
    //获取总的条数
    let resultCount = await DB.count('article',{});
    //计算总的页数
    let totalPages = Math.ceil(resultCount/pageSize);
    let result = await DB.find('article',{},{},{
        page,
        pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await ctx.render('admin/article/index',{
        list:result,
        page:page,
        totalPages:totalPages
    })
});
//渲染添加页面内容
router.get('/add',async(ctx,next)=>{
    let cateList = await DB.find('articlecate',{});
    await ctx.render('admin/article/add',{
        cateList:tools.cateToList(cateList)
    })
});
//接收客户端上传的新闻内容（普通文本和图片）
router.post('/doAdd',upload.single('img_url'),async(ctx)=>{
    //接收数据
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename;
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description  = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let add_time = tools.getTime();
    // console.log(title,catename,author,status,is_best,is_hot,is_new,keywords,description,content,img_url);
    let json = {
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
    };
    await DB.insert('article',json);
    ctx.redirect(ctx.state.__HOST__+'/admin/article')
});
//渲染编辑页面
router.get('/edit',async(ctx)=>{
    //得到id
    let id = ctx.query.id;
    let cateList = await DB.find('articlecate',{});
    let articleList = await DB.find('article',{'_id':DB.getObjectId(id)});
    await ctx.render('admin/article/edit',{
        cateList:tools.cateToList(cateList),
        list:articleList[0]
    })
});
module.exports = router.routes();