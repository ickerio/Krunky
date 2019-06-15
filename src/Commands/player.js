const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');

const social = new Social();

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
        social.getUser(args.name)
            .then(d => message.channel.send(JSON.stringify(d)))
            .catch(err => message.channel.send(JSON.stringify(err)));
    }
}

module.exports = PlayerCommand;