const http = require('http');

const HOST = '127.0.0.1';
const PORT = 3000;

http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('OK');
}).listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
