const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require('../../model/tools');
const svgCaptcha = require('svg-captcha');
// 创建二级路由
router.get("/", async (ctx, next) => {
    // ctx.body = "登录页面"
    await ctx.render("admin/login");
    await next()
});
// 处理用户登录时填写信息
router.post("/doLogin", async (ctx) => {
    // console.log("......");
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;
    // console.log({username,password,code});
    // 判断用户提交的验证码和session中保存的验证码是否一样
    if (code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase()) {
        // 验证码一至
        // 去连接数据库，对比username和password和数据库的是否一样。
        var result = await DB.find("admin", { "username": username, "password": tools.md5(password) });
        // console.log(result);
        if (result.length > 0) {
            //说明数据库有这个用户
            ctx.session.userinfo = result[0];
            //记录此时此刻的时间，更新数据库中的时间
            await DB.update("admin",{"_id":DB.getObjectId(result[0]._id)},{
                last_time:new Date() // 更新数据库中的时间为当前时间
            });
            // console.log(ctx.session);
            ctx.redirect(ctx.state.__HOST__ + "/admin")
        } else {
            // 用户名和密码错误
            ctx.render("admin/error",{
                message:"用户名和密码错误",
                redirect:ctx.state.__HOST__+"/admin/login"
            })
        }
    } else {
        // 验证码错误
        ctx.render("admin/error",{
            message:"验证码错误",
            redirect:ctx.state.__HOST__+"/admin/login"
        })
    }
});
// 生成验证码
router.get("/code", async (ctx, next) => {
    var captcha = svgCaptcha.create({
        width: 120,
        height: 40,
        fontSize: 40
    });
    // var captcha = svgCaptcha.createMathExpr({
    //     background:"skyblue",
    //     width:100,
    //     height:40,
    //     fontSize:40
    // })
    // 保存验证码
    ctx.session.code = captcha.text;
    // 设置响应头
    ctx.response.type = "image/svg+xml";
    // 响应验证码
    ctx.body = captcha.data;
    await next();
});
//退出登录
router.get('/loginOut',async(ctx,next)=>{
    ctx.session.userinfo = null;//把session中的userinfo数据清空
    ctx.redirect(ctx.state.__HOST__+'/admin/login');
    await next()
});

module.exports = router.routes();