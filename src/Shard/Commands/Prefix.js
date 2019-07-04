const Command = require('../Structs/Command.js');
const { RichEmbed } = require('discord.js');

class PrefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Prefix',
            useName: 'prefix',
            description: 'Shows how to use and change your servers prefix',
            args: { prefix: { required: false }},
            type: 'Utility',
            usage: 'prefix <new server prefix>',
            alliases: [],
            uses: 5,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { prefix }) {
        if (prefix) {
            if (!message.member.permissions.has('ADMINISTRATOR') || !this.client.options.owners.includes(message.author.id))
                return message.channel.send('Error. You must have Admin permissions to change the server prefix');

            const validation = this.client.database.guild.definitions.find(d => d.name === 'Prefix').validate(prefix);
            if (!validation) return message.channel.send('Error. Prefix must be less than 5 characters');

            this.client.database.guild.update(message.guild.id, 'Prefix', prefix);
            message.channel.send('Succesfully updated server prefix');
        } else {
            const constants = this.client.constants;

            const embed = new RichEmbed()
                .setAuthor('Server Prefix', constants.embedImages.embedHeader)
                .setDescription('Customize the prefix for your server. By default the prefix is `!kr`\nYour server prefix can be single or multi character... your choice!')
                .addField('Single Character', 'Eg `!`\nUse `!stats ickerio`', true)
                .addField('Multi Character', 'Eg `!kr`\nUse `!kr stats ickerio`\n**Note**: Notice extra space', true)
                .addField('Or just tag the bot', '`@Krunky stats ickerio`')
                .setFooter(`Do ${message.prefix.desired}prefix newPrefix to change your prefix`)
                .setThumbnail(constants.embedImages.settingsThumbnail)
                .setColor(constants.embedColour);
    
            message.channel.send(embed);
        }
    }
}

module.exports = PrefixCommand;