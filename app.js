const Koa = require("koa");
const router = require("koa-router")();
const path = require("path");
const static = require("koa-static");
const render = require('koa-art-template');  // 模板引擎
const session = require('koa-session');
const sd = require('silly-datetime');//格式化日期
const bodyParser = require("koa-bodyparser");
const jsonp = require('koa-jsonp');

// 实例化一个koa
let app = new Koa();
//配置jsonp中间件
app.use(jsonp());

// 配置Post提交数据的中间件
app.use(bodyParser());

// 配置session中间件
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    //每次请求都会重新设置session
    rolling: true,
    renew: false,
};
app.use(session(CONFIG, app));

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        //扩展模板中的方法
        return sd.format(value,'YYYY-MM-DD HH:mm')
    }
});

// 托管静态资源
app.use(static(__dirname + "/public"));

// 引入路由模块
let index = require("./routes/index");  // 前台入口
let admin = require("./routes/admin");  // 后台入口
let api = require("./routes/api");  // api台入口  h5

// 创建一级路由
router.use("/admin", admin);
router.use("/api", api);
router.use("/", index);

// 启动路由
app.use(router.routes());
app.use(router.allowedMethods());

// 监听端口
app.listen(3000);