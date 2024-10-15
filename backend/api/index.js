const serverless = require('serverless-http');
const app = require('./api/server'); // Your Express app

module.exports.handler = serverless(app);
