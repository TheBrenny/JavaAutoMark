// TODO: Expand this so it can take data from the server and display it on the page

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
        this.addEventListener('message', (event) => {
            let msg = event.data;
            console.log(msg);
        });
    }

    on(event, callback) {
        this.addEventListener(event, callback);
        return this;
    }
}