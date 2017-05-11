const log4js = require("log4js");
const path = require("path");
const fs = require("fs-extra");
const CATEGORY_NAME = "default";

/**
 * log4jsのインスタンスを返します
 * 
 * @param {object|string} opts log4jsの設定 あるいは 設定を記載したJSONファイルのパスを指定します.
 * @param {string} [level] 出力するログレベルを指定します. optsにJSONファイルを渡した場合は無視されます. (default: ALL)
 * @return {object} { logger: log4jsのインスタンス, logging: koaに渡すgeneratorメソッド }
 */
module.exports = function (opts, level = "ALL") {

  let isConfigured = false; //設定完了フラグ
  let hasWarn = false; //警告ログを表示する
  let configFile = ""; //設定ファイル
  let category = CATEGORY_NAME;

  if (typeof opts === "string") {
    if (fs.pathExistsSync(opts)) {
      console.log("hoge");
      // 設定ファイルの読み込み
      log4js.configure(opts);
      isConfigured = true;

      // log4jsインスタンス生成のためカテゴリーを取得
      const data = fs.readJsonSync(opts);
      console.log(data);

      if (Array.isArray(data.appenders) && data.appenders.length > 0) {
        // 先頭のappenderのcategoryを取得
        category = data.appenders[0].category || CATEGORY_NAME;
      }
    } else {
      hasWarn = true;
      // 警告ログ表示のためにファイル名を保持
      configFile = opts;
      // 後続処理のために空objectをセットする
      opts = {};
    }
  }
  
  if (!isConfigured) {
    opts = opts || {};
    const conf = Object.assign({
      type: "file",
      filename: "./logs/web-app.log",
      maxLogSize: 10 * 1024 * 1024, // 10MB
      backups: 10,
      category
    }, opts);

    // フォルダ作成
    const dir = path.dirname(path.resolve(conf.filename));
    fs.mkdirsSync(dir);

    // ログレベル指定
    const levels = {};
    levels[conf.category] = level.toUpperCase();

    // log4jsインスタンス生成のためカテゴリーを取得
    category = conf.category;

    // log4js設定
    log4js.configure({
      appenders: [
        { type: "console" }, conf
      ],
      levels
    });
  }

  // log4jsインスタンスの生成
  const logger = log4js.getLogger(category);
  console.log(`getLogger: ${category}`);
  if (hasWarn) {
    const msg = `Unable to load configuration file. (file: "${configFile}")`;
    logger.warn(msg);
  }

  return {
    logger,
    logging: function* (next) {
      const req = this.request;
      const header = req.header;
      logger.info(`${req.ip} - ${req.method} ${req.url}: ${req.length || ""} ${header["user-agent"]}`);
      yield next;
    }
  };
};



