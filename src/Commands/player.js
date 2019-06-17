const Command = require('../Client/Command.js');
const { Attachment } = require('discord.js');
const Cache = require('../Util/Cache/Cache.js');

const cache = new Cache(60 * 1000);

class PlayerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Player',
            useName: 'player',
            description: 'Shows player stats, levelling and funds',
            args: { name: {required: false }},
    
            type: 'Krunker',
            usage: 'player <player name>',
            alliases: [ 'p'] ,
            ownerOnly: false,
            channelTypes: ['text']
        });
    }

    async run(message, { name }) {
        // Check for tagged user's name or authors name
        if (!name || message.mentions.users.size) {
            try {
                const result = await this.client.database.getSetting(name ? message.mentions.users.first().id : message.author.id, 'username');
                name = result;
            } catch (error) {
                return message.channel.send(`No \`player name\` provided and no \`username\` set in ${message.prefix}settings`);
            }
        }

        // Check image cache
        if (cache.has(name)) return message.channel.send(cache.get(name));

        // Hit API and render image
        try {
            const data = await this.client.social.getUser(name);
            const buffer = await this.client.renderer.drawPlayerImage(data, message);
            const attachment = await new Attachment(buffer, name + '-Krunky.png');

            cache.set(name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(`An error occoured getting player ${name}`);
        }
    }
}

module.exports = PlayerCommand;