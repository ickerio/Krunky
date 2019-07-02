const Command = require('../Structs/Command.js');
const { Attachment } = require('discord.js');
const Cache = require('../../Util/Cache/Cache.js');

const cache = new Cache(15 * 60 * 1000);

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

    async run(message, { board }) {
        const boardInfo = this.client.social.boardsAlias.get(board);
        if (!boardInfo) return message.channel.send(`Error. Board ${board} does not exist! Use ${message.prefix.desired}help to see board types`);

        if (cache.has(boardInfo.name)) return message.channel.send(cache.get(boardInfo.name));

        try {
            const boardData = await this.client.social.getLeaderboard(board);
            const buffer = await this.client.renderer.drawLeaderboardImage(boardData);
            const attachment = await new Attachment(buffer, `Krunky${boardData.name}.png`);

            cache.set(boardInfo.name, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send('Error. Couldn\'t get that leaderboard');
        }
    }
}

module.exports = LeaderboardCommand;