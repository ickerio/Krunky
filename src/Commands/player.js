const { RichEmbed } = require('discord.js');
const Command = require('../structs/Command.js');
const Social = require('../SocialAPI/Social.js');

const social = new Social();

class playerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Player',
            useName: 'player',
            description: 'Gets stats on a given player',
    
            type: 'Krunker',
            usage: 'player <player name>',
            alliases: [],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run (message, args) {
        social.getUser(args[0])
            .then(d => msg.channel.send(JSON.stringify(d)))
            .catch(err => console.log(err));
    }
}

module.exports = playerCommand;