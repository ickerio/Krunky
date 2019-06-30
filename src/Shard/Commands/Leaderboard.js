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
        const fullBoard = this.client.social.boardsAlias.get(board);
        if (!fullBoard) return message.channel.send(`Board ${board} does not exist! Use ${message.prefix}help to see board types`);

        const formal = fullBoard.name;
        if (cache.has(formal)) return message.channel.send(cache.get(formal));

        try {
            const boardData = await this.client.social.getLeaderboard(board);
            const buffer = await this.client.renderer.drawLeaderboardImage(boardData);
            const attachment = await new Attachment(buffer, `Krunky${boardData.name}.png`);

            cache.set(formal, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(error.err ? `Error. ${error.er}` : `Unknown error. Couldn't get leaderboard ${board}`);
        }
    }
}

module.exports = LeaderboardCommand;