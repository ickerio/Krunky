const Discord = require('discord.js');

const Cache = require('../Structs/Cache/Cache.js');
const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');
const Renderer = require('../Structs/Renderer/Renderer.js');

const social = new Social();
const renderer = new Renderer();
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
            ownerOnly: false,
            channelTypes: ['text']
        });
    }

    async run(message, args) {
        if (cache.has(args.board)) return message.channel.send(cache.get(args.board));

        try {
            const board = await social.getLeaderboard(args.board);
            const buffer = await renderer.drawLeaderboardImage(board, message);
            const attachment = await new Discord.Attachment(buffer, 'leaderboard-' + args.board + '-Krunky.png');

            cache.set(args.board, attachment);
            message.channel.send(attachment);
        } catch (error) {
            message.channel.send(`An error occoured getting board ${args.board}`);
            console.log(error);
        }
    }
}

module.exports = LeaderboardCommand;