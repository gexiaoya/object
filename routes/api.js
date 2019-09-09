const router = require("koa-router")();
let manage = require('./api/manage');

// 创建二级路由
router.get("/",async (ctx)=>{
  ctx.body = "api接口"
});

// //管理员模块的api接口
// router.use('/manage',manage);


module.exports = router.routes();