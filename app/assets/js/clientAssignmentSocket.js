class JAMSocket extends WebSocket {
    constructor(path) {
        // This'll give us the s: from https: and add it to ws, so it becomes wss://
        super(`ws${location.protocol.substring("http".length)}//` + location.host + path);

        this.jamEvents = new JamEventEmitter();

        this.on('open', () => {
            console.log('Connected to server');
        });
        this.on('close', () => {
            console.log('Disconnected from server');
        });
        this.on('error', (err) => {
            console.error('Errored from server');
            console.error(err);
        });
        this.on('message', (event) => {
            let msg = event.data;
            console.log(msg);
            msg = msg.split(":");
            if(msg[0] == "jam") this.jamEvents.emit(msg[1], JSON.parse(msg.slice(2).join(":")));
        });
    }

    on(event, callback) {
        if(event.startsWith("jam:")) this.jamEvents.addEventListener(event.substring("jam:".length), callback);
        else this.addEventListener(event, callback);
        return this;
    }

    once(event, callback) {
        if(event.startsWith("jam:")) this.jamEvents.addEventListener(event.substring("jam:".length), callback, {once: true});
        else this.addEventListener(event, callback, {once: true});
        return this;
    }
}

class JamEventEmitter extends EventTarget {
    constructor() {
        super(...arguments);
    }

    emit(event, data) {
        this.dispatchEvent(new JamEvent(event, data));
    }
}

class JamEvent extends Event {
    constructor(event, data) {
        super(event);
        this.data = data;
    }
}