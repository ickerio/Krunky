/* eslint no-console: 0 */
class Logger {
    constructor() {
        throw new Error('Static class, do not create instance');
    }

    static command(message, command, shard) {
        this.log(`C: ${command.name} G: ${message.guild ? message.guild.name : 'DM'} A: ${message.author.tag}`, shard.id || 'N/A');
    }

    static login(tag, shard) {
        this.log(`Logged in as ${tag}!`, shard);
    }

    static startup(totalShards, shard = 'M') {
        this.log(`Krunky starting with ${totalShards} shards`, shard);
    }

    static launch(shard) {
        this.log('Launched!', shard);
    }

    static postStats(shard = 'M') {
        this.log('Posting stats', shard);
    }

    static error(error, shard) {
        this.log(error, shard);
    }

    static log(text, shard) {
        console.log(`${new Date().toUTCString()} [${shard}] - ${text}`);
    }
}

module.exports = Logger;