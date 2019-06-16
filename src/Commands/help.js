const { RichEmbed } = require('discord.js');
const Command = require('../Structs/Command.js');

class AboutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Help',
            useName: 'help',
            description: 'Shows bot info and commands',
            args: {},
    
            type: 'Util',
            usage: 'help',
            alliases: ['info', 'about'],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run(message) {
        const invUrl = `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=281600`;
        const devUrl = 'https://discord.gg/zJx726N';
        const thumbnailUrl = 'https://cdn.discordapp.com/attachments/589249378288533515/589696175985262622/krunky-help.png';
        const footerUrl = 'https://cdn.discordapp.com/attachments/589249378288533515/589698788285874176/krunky-dev.png';

        const desc = [
            `[Invite Krunky to your server](${invUrl})`,
            `[Help or suggestions](${devUrl})`,
            'NOTE: Do not include the < > in the command'
        ].join('\n');

        const embed = new RichEmbed()
            .setAuthor('Krunker.io discord bot', undefined, invUrl)
            .setDescription(desc)
            .setFooter('Made with ❤️ by @ickerio#1498 & JellyAlex#4668', footerUrl)
            .setThumbnail(thumbnailUrl)
            .setColor('#FEC400');

        this.client.commands.forEach(command => {
            if (command.name !== 'Help' && command.ownerOnly != true) embed.addField(command.usage, command.description);
        });
            
        await message.channel.send(embed);
    }
}

module.exports = AboutCommand;