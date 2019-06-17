const Discord = require('discord.js');

const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');
const Renderer = require('../Structs/Renderer/Renderer.js');
const Cache = require('../Structs/Cache/Cache.js');

const social = new Social();
const renderer = new Renderer();
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
            const data = await social.getUser(name);
            const buffer = await renderer.drawPlayerImage(data, message);
            const attachment = await new Discord.Attachment(buffer, name + '-Krunky.png');

            cache.set(name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(`An error occoured getting player ${name}`);
        }
    }
}

module.exports = PlayerCommand;