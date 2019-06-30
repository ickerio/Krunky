const fs = require('fs');
const path = require('path');

class EventHandler {
    constructor(client, options = {}) {
        this.client = client;
        this.options = options;
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        const files = fs.readdirSync(this.options.directory);
        const filepaths = files.map(f => path.resolve(`${this.options.directory}${f}`));
        filepaths.forEach(f => this.addEvent(f));
    }

    addEvent(file) {
        const event = require(file);
        event.forEach(ev => this.client.on(ev.name, ev.func.bind(this.client)));
        delete require.cache[require.resolve(file)];
    }
}

module.exports = EventHandler;