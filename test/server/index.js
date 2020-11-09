const http = require('http');

const HOST = '127.0.0.1';
const PORT = 3000;

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('OK');
});

server.on('listening', () => {
    // TODO
});

//server.on('close', () => {});

server.on('error',  error => {
    console.error(error.toString());
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
