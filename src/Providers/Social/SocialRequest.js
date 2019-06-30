const WebSocket = require('ws');
const Request = require('./Request.js');
const Message = require('./Message.js');

const ratelimit = 1000; // 1 second
const timeoutPeriod = 3000; // 3 seconds

class SocialRequest {
    constructor() {
        this.queue = [];

        this.lastRequest;
        this.sendInterval;

        this.connect();
    }

    connect() {
        this.ws = new WebSocket('wss://krunker_social.krunker.io/ws', {
            handshakeTimeout: 100
        });
        this.ws.binaryType = 'arraybuffer';

        this.ws.on('message', buf => this.message(buf));
        this.ws.on('open', () => this.nextRequest());
        this.ws.on('error', () => this.error());
    }

    addRequest(data, resolve, reject) {
        if (this.ws.readyState.CLOSED) return reject({ err: 'Krunker.io servers are down'});
        const existing = this.queue.find(r => r.endpoint === data.endpoint && r.query === data.query);
        if (existing) return existing.addListener(resolve, reject);

        const req = new Request(data.endpoint, data.query);
        req.addListener(resolve, reject);
        this.queue.push(req);

        if (new Date().getTime() - this.lastRequest > ratelimit) {
            this.send(req);
        }
    }

    send(req = this.queue.find(r => !r.timeout)) {
        if (!req || this.ws.readyState === WebSocket.CONNECTING) return this.nextRequest();
        if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) return this.connect();


        this.ws.send(Message.encode([ 'r', [ req.endpoint, req.query, '000000', null ]]));

        req.timeout = setTimeout(() => {
            req.reject({ err: 'Item does not exist'});
            this.queue = this.queue.filter(r => r !== req);
        }, timeoutPeriod);

        this.lastRequest = new Date().getTime();
        this.nextRequest();
    }

    message(buf) {
        const data = Message.decode(buf);
        if (data.toString() === [ 'pi', [] ].toString()) return this.pong();

        const prefix = ['player_score', 'player_kills', 'player_timeplayed', 'player_funds', 'player_clan', 'player_wins'].includes(data[1][1]);

        const req = this.queue.find(r => r.endpoint === data[1][0] && `${prefix ? 'player_' : ''}${r.query}` === data[1][1]);
        if (!req) return;

        req.resolve(data);
        clearTimeout(req.timeout);
        this.queue = this.queue.filter(r => r !== req);
    }

    pong() {
        this.ws.send(Message.encode([ 'po', [] ]));
    }

    nextRequest() {
        if (this.sendInterval) clearTimeout(this.sendInterval);
        this.sendInterval = setTimeout(() => this.send(), ratelimit);
    }

    error() {
        this.ws.terminate();
        this.queue.forEach(r => r.reject({ err: 'Krunker.io servers are down' }));
        setTimeout(() => this.connect(), 15 * 1000);
    }

}

module.exports = SocialRequest;