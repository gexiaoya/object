const router = require("koa-router")();
const url = require("url");
const ueditor =require('koa2-ueditor');
// 得到资源的绝对路径
router.use(async (ctx,next)=>{
    // http://localhost:3000/admin/login
    // console.log("http://"+ctx.request.header.host)
    //配置全局的变量
    ctx.state.__HOST__ = "http://"+ctx.request.header.host;
let pathname1 = url.parse(ctx.request.url).pathname;
    // 得到访问的路径
    // let pathname = url.parse(ctx.request.url).pathname
let pathname = url.parse(ctx.request.url).pathname.substring(1);
let splitUrl = pathname.split('/');
//把用户信息也保存到ctx的state上面
    ctx.state.G={
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prePage:ctx.request.header['referer']
    };
    // 权限的校验  session      cookie     jwt    auth
    if(ctx.session.userinfo){
        await next()
    }else{
        if(pathname1 == "/admin/login" || pathname1 == "/admin/login/doLogin" || pathname1 == "/admin/login/code"){
            await next()
        }else{
            ctx.redirect("/admin/login")
        }
    }
});
let index = require('./admin/index');
let login = require("./admin/login");
let manage = require('./admin/manage');
let articlecate = require('./admin/articlecate');
let article = require('./admin/article');
//后台首页面
router.use(index);//默认就是/
//登录模块
router.use("/login",login);
//管理员模块
router.use('/manage',manage);
//分类管理模块
router.use('/articlecate',articlecate);
//内容管理模块
router.use('/article',article);
// 配置富文本编辑器
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]));
module.exports = router.routes();