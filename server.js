const http = require('http');
const https = require('https');
const Koa = require('koa');

const views = require('koa-views');

const fs = require('fs');
const url = require('url');

// const index = fs.readFileSync('./public/index.html', {encoding: 'utf8'});

const app = new Koa();

function render() {
    let amount = '100';
    let exchanged = '125';

    return `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <h2>OANDA</h2>
        <h3>Currency Converter</h3>

        <form name="form" action="/blah" method="get">
            <div>Current Ammount</div>
            <input name="amount" value="${amount}" />
            <select name="source">
                <option>AUD</option>
                <option>GBP</option>
                <option>CAD</option>
                <option selected>EUR</option>
                <option>INR</option>
                <option>JPY</option>
                <option>SGD</option>
                <option>CHF</option>
                <option>USD</option>
            </select>
            <br />
            <input type="submit" name="submit" value="Switch" />
            <div>Exchanged Amount</div>
            <input disabled value="${exchanged}" />
            <select name="destination">
                <option>AUD</option>
                <option>GBP</option>
                <option>CAD</option>
                <option>EUR</option>
                <option>INR</option>
                <option>JPY</option>
                <option>SGD</option>
                <option>CHF</option>
                <option>USD</option>
            </select>
            <br />
            <div>Apply Specific Rate</div>
            <select name="rate">
                <option value="0">+/- 0% Interbank Rate</option>
                <option value="1">+/- 1%</option>
                <option value="2">+/- 2% Typical ATM Rate</option>
                <option value="3">+/- 3% Typical Credit Card Rate</option>
                <option value="4">+/- 4%</option>
                <option value="5">+/- 5% Typical Kiosk Rate</option>
            </select>
            <br />
            <input type="submit" name="submit" value="Submit" />
        </form>
    </body>
</html>`;
}

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
    const qs = x.query;

    console.log('request', JSON.stringify(qs));

    // console.log('url', JSON.stringify(x));
    // console.log('qs', ctx.request.querystring);
    // console.log('path', ctx.request.path);

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
    ctx.response.body = render();
})

http.createServer(app.callback()).listen(3000);
https.createServer({}, app.callback()).listen(3001);
