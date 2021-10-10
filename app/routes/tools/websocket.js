const {WebSocketServer} = require('ws');

class JAMSocketServer {
    constructor(id, path, options = {}) {
        this.id = id;
        this.path = path;
        this.socketServer = new WebSocketServer({noServer: true, clientTracking: true});

        if(!!options.onOpen) this.socketServer.on("listening", options.onOpen.bind(this));
        if(!!options.onConnection) this.socketServer.on("connection", options.onConnection.bind(this));
        if(!!options.onError) this.socketServer.on("error", options.onError.bind(this));
        if(!!options.onClose) this.socketServer.on("close", options.onClose.bind(this));
        if(!!options.onHeaders) this.socketServer.on("headers", options.onHeaders.bind(this));
    }

    on(event, callback) {
        this.socketServer.on(event, callback);
    }

    /**
     * @param {import('ws').WebSocket} socket 
     * @param {any} message 
     */
    send(socket, message) {
        socket.send(message);
    }

    sendToAll(message) {
        this.socketServer.clients.forEach(socket => this.send(socket, message));
    }

    handleUpgrade(req, sock, head) {
        this.socketServer.handleUpgrade(req, sock, head, (ws, request) => {
            this.socketServer.emit('connection', ws, request);
        });
    }

    close(reason) {
        reason = Object.assign({code: 1000, reason: "Server shutdown"}, reason);
        this.socketServer.clients.forEach(socket => socket.close(reason.code, reason.reason));
        this.socketServer.close();
        this.socketServer = null;
        deregisterSocketServer(this.id, this.path);
    }
}

/** @type {Object.<string, JAMSocketServer} */
const registeredListeners = {
    // "/path": JAMSocket
};


let expressServer;
let isSetUp = false;

function setup(server, forceRecreate = false) {
    if(isSetUp && !forceRecreate) return;
    isSetUp = true;
    expressServer = server;
    expressServer.on("upgrade", handleUpgrade);
}

function registerNewSocketServer(id, path, options = {}) {
    const sock = new JAMSocketServer(id, path, options);
    id = id.startsWith("#") ? id : "#" + id;
    registeredListeners[id] = sock;
    registeredListeners[path] = sock;
    return sock;
}
function deregisterSocketServer(id, path) {
    delete registeredListeners[id];
    delete registeredListeners[path];
}

function getSocketServer(idOrPath) {
    return registeredListeners[idOrPath];
}

function handleUpgrade(req, sock, head) {
    let socket = registeredListeners[req.url];

    if(!!socket) {
        socket.handleUpgrade(req, sock, head);
    } else {
        sock.write("HTTP/1.1 404 Not Found\r\n\r\n");
        sock.end().destroy();
    }
}

module.exports.setup = setup;
module.exports.registerNewSocket = registerNewSocketServer;
module.exports.getSocket = getSocketServer;
module.exports.JAMSocket = JAMSocketServer;
