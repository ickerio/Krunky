const { RichEmbed } = require('discord.js');
const Command = require('../Structs/Command.js');

class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Help',
            useName: 'help',
            description: 'Shows bot info and commands',
            args: {},
    
            type: 'Util',
            usage: 'help',
            alliases: [
                'info', 'about', 
                'invite', 'add', 
                'dev', 'developer', 'developers'
            ],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run(message) {
        const constants = this.client.constants;

        const desc = [
            `[Invite Krunky](${constants.inviteBotUrl}) to your server`,
            `[Dev Server](${constants.devServerUrl}) for help and suggestions`,
        ].join('\n');

        const embed = new RichEmbed()
            .setAuthor('Krunker.io discord bot', constants.embedImages.embedHeader, constants.inviteBotUrl)
            .setDescription(desc)
            .setFooter('ickerio#1498 & JellyAlex#4668', constants.embedImages.helpFooter)
            .setThumbnail(constants.embedImages.helpThumbnail)
            .setColor(constants.embedColour);

        this.client.commands
            .filter(command => command.name !== 'Help' && command.ownerOnly != true)
            .forEach(command => 
                embed.addField(this.client.config.PREFIX + command.usage, command.description)
            );
            
        await message.channel.send(embed);
    }
}

module.exports = HelpCommand;