const Command = require('../Client/Command.js');
const { RichEmbed } = require('discord.js');

class MapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Map',
            useName: 'map',
            description: 'Shows current game stats for a particular map',
            args: { name: { required: false }},
    
            type: 'Krunker',
            usage: 'map <map name>',
            alliases: [] ,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { name }) {

    }
}

module.exports = MapCommand;