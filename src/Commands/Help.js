const Command = require('../Client/Command.js');
const { RichEmbed } = require('discord.js');

class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Help',
            useName: 'help',
            description: 'Shows bot info and commands',
            args: {},
            type: 'Utility',
            usage: 'help',
            alliases: [
                'info', 'about', 
                'invite', 'add', 
                'dev', 'developer', 'developers'
            ],
            uses: 15,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'dm', 'group', 'text' ]
        });
    }

    async run(message) {
        const constants = this.client.constants;

        const desc = [
            `[Invite Krunky](${constants.inviteBotUrl(this.client.config.ID)}) to your server`,
            `[Dev Server](${constants.devServerUrl}) for help and suggestions`,
            `[Vote](${constants.voteUrl(this.client.config.ID)}) to show your support`
        ].join('\n');

        const embed = new RichEmbed()
            .setAuthor('Krunker.io discord bot', constants.embedImages.embedHeader, constants.inviteBotUrl(this.client.config.ID))
            .setDescription(desc)
            .setFooter('ickerio#1498 & JellyAlex#4668', constants.embedImages.helpFooter)
            .setThumbnail(constants.embedImages.helpThumbnail)
            .setColor(constants.embedColour);

        this.client.commandHandler.commands
            .filter(command => command.name !== 'Help' && command.ownerOnly != true)
            .forEach(command => 
                embed.addField(message.prefix + command.usage, command.description)
            );
            
        message.channel.send(embed);
    }
}

module.exports = HelpCommand;