const http = require('http');

const HOST = '127.0.0.1';
const PORT = 3000;

const server = http.createServer((request, response) => {
    const {method, url, headers} = request;
    let body = [];

    request.on('error', error => {
        console.error(error);
    }).on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        switch ( method ) {
            case 'GET':
                if ( url.split('/').pop() === 'sessions') {
                    // TODO
                }

                break;
        }
    });
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
