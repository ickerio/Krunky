const Discord = require('discord.js'); 
const Command = require('../structs/Command.js');

class helpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Help',
            useName: 'help',
            description:  'Displays all bot commands or just info on a specific one.',
    
            type: 'Util',
            usage: 'help <optional command name>',
            alliases: [],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run (message, args) {
        if(args.length !== 0) {
            // Displaying help on a single command
            const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.get(this.client.alliases.get(args[0].toLowerCase()));
            if(!command) return message.reply('The command does not exist');

            message.channel.send(`**${command.usage}**\n${command.description}${command.alliases.length !== 0  ? `\nAlliases: ${command.alliases.join(', ')}` : ''}`);
        } else {
            // Displaying help for all commands
            const embed = new Discord.RichEmbed()
                .setColor(this.client.config.COLOUR)
                .setAuthor('Krunky Commands', this.client.user.avatarURL);
    
            // Only add commands they're allowed access to
            this.client.commands.forEach(command => {
                if(!(command.ownerOnly && message.author.id !== this.client.config.OWNER))
                    embed.addField(command.usage,`${command.description}${command.alliases.length !== 0  ? `\nAlliases: ${command.alliases.join(', ')}` : ''}`);
            });
    
            await message.author.send(embed);
            if (message.channel.type !== 'dm') message.reply('I have DMed you the full list of commands.');
        }
    }
}

module.exports = helpCommand;