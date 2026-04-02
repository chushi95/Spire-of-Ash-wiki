const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log(`200 ${req.url}`);
    }
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('Spire of Ash Wiki 本地服务器');
  console.log('========================================');
  console.log('');
  console.log('✅ 服务器已启动！');
  console.log('');
  console.log('📱 请在浏览器中访问:');
  console.log('   http://localhost:' + PORT);
  console.log('');
  console.log('⏹️  按 Ctrl+C 停止服务器');
  console.log('========================================');
  console.log('');
});
