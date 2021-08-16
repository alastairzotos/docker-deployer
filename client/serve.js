const handler = require('serve-handler');
const http = require('http');
const path = require('path');

http.createServer(
  (req, res) => handler(req, res, { public: path.resolve(__dirname, 'build'), cleanUrls: true })
).listen(4044);
