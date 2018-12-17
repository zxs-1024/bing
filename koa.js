const koa = require('koa')
const app = new koa()

app.use(async ctx => {
  console.log(ctx.request)
  ctx.body = 'Hello World'
})

app.listen(9527, () => {
  console.log('启动 9527')
})

app.on('error', err => {
  log.error('server error', err)
})
