# @kazunori-kimura/koa-log4js

logger middleware for koa

## Install

```
npm install @kazunori-kimura/koa-log4js
```

## Usage

```js
const koa = require("koa");
const app = koa();
const Log = require("../index.js");

const PORT = 3000;
const logfile = `${__dirname}/app.log`;

// set log4js configuration
const log = Log({ filename: logfile });
// get logger instance
const logger = log.logger;

// set logging middleware
app.use(log.logging);

app.use(function* (){
  this.body = "Hello, world!";
});

app.listen(PORT);
logger.info(`listen at http://localhost:${PORT}`);
```

## LICENSE

MIT
