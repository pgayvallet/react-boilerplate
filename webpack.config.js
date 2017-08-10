
const buildConfig = require("./webpack/build-client-config");
module.exports = buildConfig(process.env.NODE_ENV || 'production');