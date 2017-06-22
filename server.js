const http = require('http');
const https = require('https');
const Koa = require('koa');

const views = require('koa-views');

const fs = require('fs');
const url = require('url');

const index = fs.readFileSync('./public/index.html', {encoding: 'utf8'});

const app = new Koa();

// x-response-time
// app.use(async function (ctx, next) {
//     const start = new Date();
//     await next();
//     const ms = new Date() - start;
//     ctx.set('X-Response-Time', `${ms}ms`);
// });

// Logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// app.use(views(__dirname + '/public', {
//     map: {

//     }
// }));

// Router
app.use(async (ctx, next) => {
    const x = url.parse(ctx.request.href, true);

    console.log('request', JSON.stringify(ctx.request));

    console.log('url', JSON.stringify(x));
    console.log('qs', ctx.request.querystring);
    console.log('path', ctx.request.path);

    await next();
});

// Response
// app.use(async ctx => {
//     await ctx.render()
// })
app.use(ctx => {
//     console.log('qs', ctx.request.querystring);
//     console.log('path', ctx.request.path);

    ctx.response.status = 200;
    ctx.response.body = index;
})

http.createServer(app.callback()).listen(3000);
https.createServer({}, app.callback()).listen(3001);
