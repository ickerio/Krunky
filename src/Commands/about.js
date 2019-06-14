const { RichEmbed } = require('discord.js');
const Command = require('../Structs/Command.js');

class aboutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'About',
            useName: 'about',
            description:  'Short description of the bot.',
    
            type: 'Util',
            usage: 'about',
            alliases: ['info'],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run (message) {
        const date = new Date(this.client.uptime);
    
        const embed = new RichEmbed()
            .setAuthor('Krunky', this.client.user.displayAvatarURL, 'https://krunker.io')
            .setColor(this.client.config.COLOUR)
    
            // Main Info
            .setDescription(`Shard ${this.client.shard.id + 1}/${this.client.shard.count} has been running for ${date.getUTCDate()-1 !== 0 ? `${date.getUTCDate()-1} days ` : ''}${date.getUTCHours()} hours ${date.getUTCMinutes()} minutes, serving ${this.client.guilds.size} servers and ${this.client.users.size} users`)
    
            // Extra info
            .addField('Main Server', '[Krunker.io](http://discord.gg/krunker)', true)
            .addField('Invite Link', `[Click Here](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=281600)`, true)
            .addField('Developer', `<@${this.client.config.OWNER}>`);
        await message.channel.send(embed);
    }
}

module.exports = aboutCommand;