class JAMSocket extends WebSocket {
    constructor(path) {
        super("ws://" + location.host + path);
        this.addEventListener('open', () => {
            console.log('Connected to server');
        });
        this.addEventListener('close', () => {
            console.log('Disconnected from server');
        });
        this.addEventListener('error', (err) => {
            console.error('Errored from server');
            console.error(err);
        });
        this.addEventListener('message', (data) => {
            console.log(data);
        });
    }

    on(event, callback) {
        this.addEventListener(event, callback);
        return this;
    }
}