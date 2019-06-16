const Discord = require('discord.js');

const Cache = require('../Structs/Cache/Cache.js');
const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');
const Renderer = require('../Structs/Renderer/Renderer.js');

const social = new Social();
const renderer = new Renderer();
const cache = new Cache(60 * 1000);

// Load krunker images.

class PlayerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Player',
            useName: 'player',
            description: 'Gets stats on a given player',
            args: { name: {required: true }},
    
            type: 'Krunker',
            usage: 'player <player name>',
            alliases: [],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run(message, args) {
        if (cache.has(args.name)) return message.channel.send(cache.get(args.name));

        try {
            const data = await social.getUser(args.name);
            const buffer = await renderer.drawPlayerImage(data, message);
            const attachment = await new Discord.Attachment(buffer, args.name + '-Krunky.png');

            cache.set(args.name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.reply('an error occoured.');
        }
    }
}

module.exports = PlayerCommand;