const Command = require('../Structs/Command.js');
const { Attachment } = require('discord.js');
const Cache = require('../../Util/Cache/Cache.js');

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
        const mention = name ? name.match(/<@!?(\d+)>/) : undefined;
        if (!name || mention) {
            name = await this.client.database.user.get(mention ? mention[1] : message.author.id, 'KrunkerName');
        }

        if (!name) {
            const error = `${mention ? 'Mentioned user hasn\'t linked their' : 'You haven\'t linked your'} username with ${message.prefix.desired}save`;
            return message.channel.send(`Error. ${error}`);
        }

        if (cache.has(name)) return message.channel.send(cache.get(name));

        try {
            const data = await this.client.social.getUser(name);
            const buffer = this.client.renderer.drawPlayerImage(data);
            const attachment = await new Attachment(buffer, `Krunky${name}.png`);

            cache.set(name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send('Error. Couldn\'t get stats for that user');
        }
    }
}

module.exports = StatsCommand;