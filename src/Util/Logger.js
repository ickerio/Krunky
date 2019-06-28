/* eslint no-console: 0 */
class Logger {
    constructor() {
        throw new Error('Static class, do not create instance');
    }

    static command(message, command, shard) {
        this.log(`C: ${command.name} G: ${message.guild ? message.guild.name : 'DM'} A: ${message.author.tag}`, shard ? shard.id : 'N/A');
    }

    static log(text, id) {
        console.log(`${new Date().toUTCString()} [${id}] - ${text}`);
    }


}

module.exports = Logger;