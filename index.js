const log4js = require("log4js");
const path = require("path");
const fs = require("fs-extra");
const CATEGORY_NAME = "default";

module.exports = function (opts) {

  opts = opts || {};
  const conf = Object.assign({
    type: "file",
    filename: "./logs/web-app.log",
    maxLogSize: 10 * 1024 * 1024, // 10MB
    backups: 10,
    category: CATEGORY_NAME
  }, opts);

  // フォルダ作成
  const dir = path.dirname(path.resolve(conf.filename));
  fs.mkdirsSync(dir);

  log4js.configure({
    appenders: [
      { type: "console" }, conf
    ]
  });
  const logger = log4js.getLogger(conf.category);

  return {
    logger,
    logging: function* (next) {
      const req = this.request;
      const header = req.header;
      logger.trace(`${req.ip} - ${req.method} ${req.url}: ${req.length || ""} ${header["user-agent"]}`);
      yield next;
    }
  };
};