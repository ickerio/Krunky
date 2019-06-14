const WebSocket = require('ws');
const Request = require('./Request.js');
const Message = require('./Message.js');

const ratelimit = 1000; // 1 second
const timeoutPeriod = 3000; // 3 seconds

let timeStart;

class RequestQueue {
    constructor() {
        this.queue = [];
        this.lastRequest;
        this.sendInterval;

        this.connect();
    }

    connect() {
        this.ws = new WebSocket('wss://krunker_social.krunker.io/ws');
        this.ws.binaryType = 'arraybuffer';

        this.ws.on('message', buf => this.message(buf));
        this.ws.on('open', () => this.nextRequest());
    }

    addRequest(user, resolve, reject) {
        const existing = this.queue.find(r => r.user = user);
        if (existing) return existing.addListener(resolve, reject);

        const req = new Request(user);
        req.addListener(resolve, reject);
        this.queue.push(req)

        if (new Date().getTime() - this.lastRequest > ratelimit) {
            this.send(req);
        }
    }

    send(req = this.queue.find(r => !r.timeout)) {
        if (!req) return this.nextRequest();

        if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
            return this.connect();
        }

        this.ws.send(Message.encode(['r', ['profile', req.user, '', null]]));

        req.timeout = setTimeout(() => {
            req.rejects.forEach(r => r());
            this.queue = this.queue.filter(r => r !== req);
        }, timeoutPeriod);

        this.lastRequest = new Date().getTime();
        this.nextRequest();
    }

    message(buf) {
        const data = Message.decode(buf)[1][2];
        if (!data) return;

        const req = this.queue.find(i => i.user === data.player_name);
        if (!req) return;

        req.resolve(data)
        clearTimeout(req.timeout);
        this.queue = this.queue.filter(r => r !== req);
    }

    nextRequest() {
        if (this.sendInterval) clearTimeout(this.sendInterval);
        this.sendInterval = setTimeout(() => this.send(), ratelimit);
    }

}

module.exports = RequestQueue;