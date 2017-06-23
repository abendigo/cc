const http = require('http');
const https = require('https');
const Koa = require('koa');

const views = require('koa-views');

const fs = require('fs');
const url = require('url');

const data = require('./data');

// const index = fs.readFileSync('./public/index.html', {encoding: 'utf8'});

const app = new Koa();

const instruments = [
    {key: 'AUD', value: 'AUD'},
    {key: 'GBP', value: 'GBP'},
    {key: 'CAD', value: 'CAD'},
    {key: 'EUR', value: 'EUR'},
    {key: 'INR', value: 'INR'},
    {key: 'JPY', value: 'JPY'},
    {key: 'SGD', value: 'SGD'},
    {key: 'CHF', value: 'CHF'},
    {key: 'USD', value: 'USD'}
];
const specificRates = [
    {key: '0.00', value: '+/- 0% Interbank Rate'},
    {key: '0.01', value: '+/- 1%'},
    {key: '0.02', value: '+/- 2% Typical ATM Rate'},
    {key: '0.03', value: '+/- 3% Typical Credit Card Rate'},
    {key: '0.04', value: '+/- 4%'},
    {key: '0.05', value: '+/- 5% Typical Kiosk Rate'}
];

function render(session) {

    function renderOption(next, isSelected) {
        return `<option${isSelected ? ' selected' : ''} value="${next.key}">${next.value}</option>`
    }

    function renderOptions(values, selected) {
        return values.map(next => renderOption(next, next.key === selected)).join('\n');
    }

    return `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <h2>OANDA</h2>
        <h3>Currency Converter</h3>

        <form name="form" action="/blah" method="get">
            <div>Current Ammount</div>
            <input name="amount" value="${session.amount}" />
            <select name="source">
                ${renderOptions(instruments, session.source)}
            </select>
            <br />
            <input type="submit" name="submit" value="Switch" />
            <div>Exchanged Amount</div>
            <input disabled value="${session.exchanged}" />
            <select name="destination">
                ${renderOptions(instruments, session.destination)}
            </select>
            <br />
            <div>Apply Specific Rate</div>
            <select name="rate">
                ${renderOptions(specificRates, session.specificRate)}
            </select>
            <br />
            <input type="submit" name="submit" value="Submit" />
        </form>
    </body>
</html>`;
}

// Logger
// app.use(async (ctx, next) => {
//     const start = Date.now();
//     await next();
//     const ms = Date.now() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// Router
// app.use(async (ctx, next) => {
//     const x = url.parse(ctx.request.href, true);
//     const qs = x.query;

//     console.log('request', JSON.stringify(qs));

//     // console.log('url', JSON.stringify(x));
//     // console.log('qs', ctx.request.querystring);
//     // console.log('path', ctx.request.path);

//     await next();
// });

// Response
// app.use(async ctx => {
//     await ctx.render()
// })
app.use(ctx => {

    const x = url.parse(ctx.request.href, true);
// console.log('x', x);
    const qs = x.query;
    console.log('qs', qs)

    if (x.path === '/favicon.ico') {
        ctx.response.status = 200;
        ctx.response.body = 'nope';
        return;
    }

    let session = {};
    if (qs.source && qs.destination) {

        session.specificRate = qs.rate;
        session.amount = qs.amount;
        if (qs.submit === 'Switch') {
            session.source = qs.destination;
            session.destination = qs.source;
        } else {
            session.source = qs.source;
            session.destination = qs.destination;
        }

        let sRate = data.rates.currencies[session.source];
        let dRate = data.rates.currencies[session.destination];
        session.exchanged = qs.amount * (dRate.b / sRate.a) * (1 - qs.rate);
    }

    ctx.response.status = 200;
    ctx.response.body = render(session);
})

http.createServer(app.callback()).listen(3000);
https.createServer({}, app.callback()).listen(3001);
