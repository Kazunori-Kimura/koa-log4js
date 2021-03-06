// test.js
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
