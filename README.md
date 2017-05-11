# @kazunori-kimura/koa-log4js

logger middleware for koa

## Install

```
npm install @kazunori-kimura/koa-log4js
```

## Usage

### ログ設定をJSONで渡す

```js
const koa = require("koa");
const app = koa();
const Log = require("../index.js");

const PORT = 3000;
const logfile = `${__dirname}/app.log`;

// set log4js configuration
const log = Log({ filename: logfile }, "INFO");
// get logger instance
const logger = log.logger;

// set logging middleware
app.use(log.logging);

app.use(function* (){
  this.body = "Hello, world!";
});

app.listen(PORT);
logger.info(`listen at http://localhost:${PORT}`);

const msg = "test log.";
logger.trace(msg);
logger.debug(msg);
logger.info(msg);
logger.warn(msg);
logger.error(msg);
logger.fatal(msg);
```

### 設定ファイルを使用

`config.json`

```json
{
  "appenders": [
    {
      "type": "dateFile",
      "category": "test",
      "filename": "test/system.log",
      "pattern": "-yyyy-MM-dd"
    },
    { "type": "console" }
  ],
  "levels": { "test": "INFO" }
}
```

上記JSONファイルを保存し、そのパスを渡してインスタンスを取得します

```js
const koa = require("koa");
const app = koa();
const Log = require("../index.js");

const PORT = 3000;

// set log4js configuration
const log = Log(`${__dirname}/config.json`);
// get logger instance
const logger = log.logger;

// set logging middleware
app.use(log.logging);

app.use(function* (){
  this.body = "Hello, world!";
});

app.listen(PORT);
logger.info("--- test-config.js ---");
logger.info(`listen at http://localhost:${PORT}`);

const msg = "test log.";
logger.trace(msg);
logger.debug(msg);
logger.info(msg);
logger.warn(msg);
logger.error(msg);
logger.fatal(msg);
```

#### 設定ファイルについて

`appenders` に複数の設定を記載した場合、使用されるのは先頭に記載した `appender` になります。


## LICENSE

MIT
