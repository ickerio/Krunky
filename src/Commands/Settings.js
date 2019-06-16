const { RichEmbed } = require('discord.js');
const Command = require('../Structs/Command.js');

class SettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Settings',
            useName: 'settings',
            description: 'Customize the bot for you and your guild',
            args: { 
                option: { required: false },
                value: { required: false }
            },
    
            type: 'Utility',
            usage: 'settings <optional setting name>',
            alliases: [],
            ownerOnly: true,
            channelTypes: ['text']
        });
    }

    async run(message, { option, value }) {
        if (!option) return this.displayAllOptions(message);
        if (option && !value) return this.displayOption(message, option);
        if (option && value) return this.changeOption(message, option, value);
        message.channel.send('An error occoured changing settings');
    }

    async displayAllOptions(message) {
        if (message.member.permissions.has('ADMINISTRATOR')) this.displayGuildOptions(message);
        this.displayUserOptions(message);
    }

    async displayUserOptions(message) {
        const embed = new RichEmbed()
            .setAuthor('Krunky User Settings')
            .setDescription(`Use the command format \`${this.client.config.PREFIX}settings <option>\` to view more info about an option.`)
            .setThumbnail(this.client.constants.embedImages.settingsThumbnail)
            .setColor(this.client.constants.embedColour);

        this.client.database.settings
            .filter(set => set.type === 'User')
            .forEach(set => 
                embed.addField('\u200B', `**${set.displayName}**\n\`${this.client.config.PREFIX}settings ${set.usage}\`\n${set.description}`)
            );
        
        message.channel.send(embed);
    }

    async displayGuildOptions(message) {
        const embed = new RichEmbed()
            .setAuthor('Krunky Admin Panel')
            .setDescription(`Use the command format \`${this.client.config.PREFIX}settings <option>\` to view more info about an option.`)
            .setThumbnail(this.client.constants.embedImages.settingsThumbnail)
            .setColor(this.client.constants.embedColour);

        this.client.database.settings
            .filter(set => set.type === 'Guild')
            .forEach(set => 
                embed.addField(set.displayName, `\`${this.client.config.PREFIX}settings ${set.usage}\``)
            );
        
        message.channel.send(embed);
    }

    async displayOption(message, option) {
        const setting = this.client.database.settings.find(set => set.usage === option);
        if (!setting) return message.channel.send(`No such setting \`${option}\``);
        if (setting.type === 'Guild' && message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`\`Administrator\` permission is required to check setting \`${setting.displayName}\``);

        const embed = new RichEmbed()
            .setAuthor(`Krunky ${setting.type === 'Guild' ? 'Admin Panel' : 'User Settings'} - ${setting.displayName} `)
            .setDescription(setting.description)
            .setThumbnail(this.client.constants.embedImages.settingsThumbnail)
            .setColor(this.client.constants.embedColour);

        const current = await this.client.database.getSetting(setting.type === 'Guild' ? message.guild.id : message.author.id, setting.usage);
        await embed.addField('Current', current[setting.dbRow]);

        embed
            .addField('Update', `${this.client.config.PREFIX}settings ${setting.usage} <parameter>`)
            .addField('Valid settings', setting.valid);

        message.channel.send(embed);
    }

    async changeOption(message, option, value) {
        const setting = this.client.database.settings.find(set => set.usage === option);
        if (!setting) return message.channel.send(`No such setting \`${option}\``);
        if (setting.type === 'Guild' && message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`\`Administrator\` permission is required to check setting \`${setting.displayName}\``);

        await this.client.database.setSetting(setting.type === 'Guild' ? message.guild.id : message.author.id, setting.usage, value);

        message.channel.send(`Updated your ${setting.type.toLowerCase()} setting \`${setting.displayName}\` to \`${value}\``);
    }
}

module.exports = SettingsCommand;