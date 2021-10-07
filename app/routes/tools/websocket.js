const {WebSocketServer} = require('ws');

class JAMSocket {
    constructor(path, onMessage, options = {}) {
        this.path = path;
        this.onMessage = onMessage;
        this.socket = new WebSocketServer({noServer: true, clientTracking: true});

        this.socket.on("connection", (ws, request) => {
            ws.on("message", this.onMessage.bind(this, ws));
            this.send(ws, "Hello from the server!");
        });

        if(!!options.onOpen) this.socket.on("listening", options.onOpen.bind(this));
        if(!!options.onConnection) this.socket.on("connection", options.onConnection.bind(this));
        if(!!options.onError) this.socket.on("error", options.onError.bind(this));
        if(!!options.onClose) this.socket.on("close", options.onClose.bind(this));
        if(!!options.onHeaders) this.socket.on("headers", options.onHeaders.bind(this));
    }

    /**
     * @param {import('ws').WebSocket} socket 
     * @param {any} message 
     */
    send(socket, message) {
        // MAYBE: log all inbound and outbound messages?
        socket.send(message);
    }

    sendToAll(message) {
        this.socket.clients.forEach(socket => this.send(socket, message));
    }

    handleUpgrade(req, sock, head) {
        this.socket.handleUpgrade(req, sock, head, (ws, request) => {
            this.socket.emit('connection', ws, request);
        });
    }

    close() {
        // TODO: CLOSE FLOW
        // Send a goodbye to all clients
        // Close the socket
        // De-register this object
        // Destroy this object
    }
}

/** @type {Object.<string, JAMSocket} */
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

function registerNewSocket(id, path, onMessage, options = {}) {
    const sock = new JAMSocket(path, onMessage, options);
    id = id.startsWith("#") ? id : "#" + id;
    registeredListeners[id] = sock;
    registeredListeners[path] = sock;
    return sock;
}

function getSocket(idOrPath) {
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
module.exports.registerNewSocket = registerNewSocket;
module.exports.getSocket = getSocket;
module.exports.JAMSocket = JAMSocket;
