'use strict';

const http = require('http');
const {v4: uuidv4} = require('uuid');

const mockUsers    = require('../data/users.json');
const mockProjects = require('../data/projects.json');

const HOST = '127.0.0.1';
const PORT = 4000;
const SESSION_TIME_SECONDS = 900;

const sessions = {};

const getSessionId = () => {
    return uuidv4();
};

const server = http.createServer((request, response) => {
    const {method, url: path, headers: requestHeaders} = request;

    let requestData = [];

    request.on('error', error => {
        console.error(error);
    }).on('data', chunk => {
        requestData.push(chunk);
    }).on('end', () => {
        requestData = Buffer.concat(requestData).toString();

        console.log('--------- request ---------');
        console.log('Method: ', method);
        console.log('Path: ', path);
        console.log('Request headers: ', requestHeaders);
        console.log('Incoming data: ', requestData);

        switch ( method ) {
            case 'GET':
                if ( path.split('/').pop() === 'getUserData' ) {
                    // TODO: check if user is authorized
                    response.writeHead(200, {
                        //'Access-Control-Allow-Origin': requestHeaders.origin,
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify(/* user data */{}));
                }

                break;
            case 'POST':
                if ( path.split('/').pop() === 'sessions' ) {
                    try {
                        requestData = JSON.parse(requestData);
                    } catch ( exception ) {
                        response.statusCode = 400;
                        response.end();
                    }

                    // TODO: implement checking session (sessionId in request)
                    const {login, password} = requestData;

                    // TODO: improve security and reliability
                    for ( const user of mockUsers ) {
                        if ( login === user.login && password === user.password ) {
                            const sessionId = getSessionId();

                            sessions[sessionId] = {login};

                            response.writeHead(200, {
                                'Access-Control-Allow-Origin': requestHeaders.origin,
                                'Content-Type': 'application/json'
                            });
                            response.end(JSON.stringify({sessionId}));
                        }
                    }

                    //response.statusCode = 404;
                    //response.end();
                }

                break;
            case 'OPTIONS':
                response.writeHead(200, {
                    'Access-Control-Allow-Origin':   requestHeaders.origin,
                    'Access-Control-Allow-Methods':  'GET, POST, DELETE',
                    'Access-Control-Max-Age':        SESSION_TIME_SECONDS,
                    'Access-Control-Allow-Headers':  'Content-Type'
                });
                response.end();

                break;
            case 'DELETE':
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
