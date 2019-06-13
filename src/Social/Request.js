class Request {
    constructor(user) {
        this.user = user;
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