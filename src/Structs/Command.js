class Command {
    constructor(client, options) {
        this.client = client;

        this.name = options.name || 'No Name';
        this.useName = options.useName;
        this.description = options.description || 'No Description';
        this.args = [];

        this.type = options.type || 'default';
        this.usage = options.usage || '<command> <args>';
        this.alliases = options.alliases || [];
        this.ownerOnly = options.ownerOnly || false;
        this.channelTypes = options.channelTypes || ['dm', 'group', 'text'];
    }

    run(message, args) { // eslint-disable-line no-unused-vars
        throw new TypeError(`Command ${this.name} not set`);
    }
}

module.exports = Command;