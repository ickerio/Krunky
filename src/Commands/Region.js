const Command = require('../Client/Command.js');
const { RichEmbed } = require('discord.js');

class RegionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Region',
            useName: 'region',
            description: 'Shows current game stats for a particular region',
            args: { region: { required: true }},
    
            type: 'Krunker',
            usage: 'region <region name>',
            alliases: [] ,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { name }) {

    }
}

module.exports = RegionCommand;