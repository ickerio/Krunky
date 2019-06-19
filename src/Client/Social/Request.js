class Request {
    constructor(endpoint, query) {
        this.endpoint = endpoint;
        this.query = query;
        this.timeout;

        this.resolves = [];
        this.rejects = [];
    }

    addListener(resolve, reject) {
        this.resolves.push(resolve);
        this.rejects.push(reject);
    }

    reject(error) {
        this.rejects.forEach(r => r(error));
    }

    resolve(data) {
        this.resolves.forEach(r => r(data));
    }
}

module.exports = Request;