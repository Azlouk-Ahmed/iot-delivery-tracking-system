const colors = require("colors/safe");

const log = (level, source, message) => {
  const timestamp = new Date().toISOString();
  let output = `[${timestamp}] [${level}] [${source}] ${message}`;

  switch (level) {
    case "INFO":
      console.log(colors.cyan(output));
      break;
    case "WARN":
      console.warn(colors.yellow(output));
      break;
    case "ERROR":
      console.error(colors.red(output));
      break;
    case "SUCCESS":
      console.log(colors.green(output));
      break;
    default:
      console.log(output);
  }
};

module.exports = {
  info: (src, msg) => log("INFO", src, msg),
  success: (src, msg) => log("SUCCESS", src, msg),
  warn: (src, msg) => log("WARN", src, msg),
  error: (src, msg) => log("ERROR", src, msg),
};
