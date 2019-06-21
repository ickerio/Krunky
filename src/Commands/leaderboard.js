const Command = require('../Client/Command.js');
const { Attachment } = require('discord.js');
const Cache = require('../Util/Cache/Cache.js');

const cache = new Cache(60 * 1000);

class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Leaderboard',
            useName: 'leaderboard',
            description: 'Shows top players for the leaderboard type\n*Types*: level, kills, wins, time, krunkies, clans.',
            args: { board: { required: true }},
            type: 'Krunker',
            usage: 'leaderboard <board name>',
            alliases: [ 'lb' ],
            uses: 8,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, args) {
        if (cache.has(args.board)) return message.channel.send(cache.get(args.board));

        try {
            const board = await this.client.social.getLeaderboard(args.board);
            const buffer = await this.client.renderer.drawLeaderboardImage(board);
            const attachment = await new Attachment(buffer, `Krunky-leaderboard_${board.name}.png`);

            cache.set(args.board, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(`An error occurred getting board ${args.board}`);
        }
    }
}

module.exports = LeaderboardCommand;