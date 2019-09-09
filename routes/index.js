const router = require("koa-router")();

// 创建二级路由
router.get("/",async (ctx)=>{
  ctx.body = "前台首页面"
});

module.exports = router.routes();