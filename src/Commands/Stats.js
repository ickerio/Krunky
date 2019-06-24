const Command = require('../Client/Command.js');
const { Attachment } = require('discord.js');
const Cache = require('../Util/Cache/Cache.js');

const cache = new Cache(60 * 1000);

class StatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Stats',
            useName: 'stats',
            description: 'Shows player stats, levelling and funds',
            args: { name: { required: false }},
            type: 'Krunker',
            usage: 'stats <player name>',
            alliases: [ 's', 'player' ] ,
            uses: 8,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { name }) {
        // Check for tagged user's name or authors name
        if (!name || message.mentions.users.size) {
            try {
                const result = await this.client.database.userGet(name ? message.mentions.users.first().id : message.author.id, 'KrunkerName');
                if (!result) return message.channel.send(`Error. Unknown username. Set with \`${message.prefix}settings krunkername\``); // change throw error
                name = result;
            } catch (error) {
                return message.channel.send(`Error. Unknown username. Set with \`${message.prefix}settings krunkername\``);
            }
        }

        // Check image cache
        if (cache.has(name)) return message.channel.send(cache.get(name));

        // Hit API and render image
        try {
            const data = await this.client.social.getUser(name);
            const buffer = this.client.renderer.drawPlayerImage(data);
            const attachment = await new Attachment(buffer, `Krunky-stas_${name}.png`);

            cache.set(name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(error.err ? `Error. ${error.er}` : `Unknown error. Couldn't get stats for ${name}`);
        }
    }
}

module.exports = StatsCommand;