const Command = require('../Structs/Command.js');
const { RichEmbed } = require('discord.js');

class SettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Settings',
            useName: 'settings',
            description: 'Customize the bot for you and your server',
            args: { 
                option: { required: false },
                value: { required: false }
            },
            type: 'Utility',
            usage: 'settings <optional setting name>',
            alliases: [ 'setting' ],
            uses: 15,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { option, value }) {
        await this.client.database.user.add(message.author.id);

        if (!option) return this.displayAllOptions(message);
        if (option && !value) return this.displayOption(message, option);
        if (option && value) return this.changeOption(message, option, value);
        message.channel.send('An error occurred changing settings');
    }

    // List all settings
    async displayAllOptions(message) {
        this.displayUserOptions(message);
        if (message.member.permissions.has('ADMINISTRATOR')) this.displayGuildOptions(message);
    }

    // User settings
    async displayUserOptions(message) {
        const embed = new RichEmbed()
            .setAuthor('Krunky User Settings', this.client.constants.embedImages.embedHeader)
            .setDescription(`Use the command format \`${message.prefix.desired}settings <option>\` to view more info about an option.`)
            .setThumbnail(this.client.constants.embedImages.settingsThumbnail)
            .setColor(this.client.constants.embedColour);

        this.client.database.definitions
            .filter(def => def.type === 'User')
            .forEach(def => 
                embed.addField(`${message.prefix.desired}settings ${def.usage} yourChoiceHere`, def.description)
            );
        
        message.channel.send(embed);
    }

    // Guild settings
    async displayGuildOptions(message) {
        const embed = new RichEmbed()
            .setAuthor('Krunky Admin Panel', this.client.constants.embedImages.embedHeader)
            .setColor(this.client.constants.embedColour);

        this.client.database.definitions
            .filter(def => def.type === 'Guild')
            .forEach(def => 
                embed.addField(`${message.prefix.desired}settings ${def.usage} yourChoiceHere`, def.description)
            );
        
        message.channel.send(embed);
    }

    // Specify one setting
    async displayOption(message, option) {
        const setting = this.client.database.definitions.find(def => def.usage === option);
        if (!setting) return message.channel.send(`No such setting \`${option}\``);
        if (setting.type === 'Guild' && !message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`\`Administrator\` permission is required to check setting \`${setting.displayName}\``);

        const current = setting.type === 'User' ? await this.client.database.user.get(message.author.id, setting.dbRow) : await this.client.database.guild.get(message.guild.id, setting.dbRow);

        const embed = new RichEmbed()
            .setAuthor(`Krunky ${setting.type === 'Guild' ? 'Admin Panel' : 'User Settings'} - ${setting.displayName}`, this.client.constants.embedImages.embedHeader)
            .setDescription(setting.description)
            .setThumbnail(this.client.constants.embedImages.settingsThumbnail)
            .setColor(this.client.constants.embedColour)
            .addField('Current', (current === null || current === undefined) ? 'Unset' : setting.displayConvert(current))
            .addField('Update', `${message.prefix}settings ${setting.usage} <${setting.displayName.toLowerCase()}>`)
            .addField('Valid settings', setting.valid);

        message.channel.send(embed);
    }

    // Change a setting
    async changeOption(message, option, value) {
        const setting = this.client.database.definitions.find(def => def.usage === option);
        if (!setting) return message.channel.send(`No such setting \`${option}\``);
        if (setting.type === 'Guild' && !message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`\`Administrator\` permission is required to check setting \`${setting.displayName}\``);

        if (!setting.validate(value)) return message.channel.send(`\`${value}\` must be valid ${setting.displayName.toLowerCase()}`);

        setting.type === 'User' ? await this.client.database.user.update(message.author.id, setting.dbRow, setting.databaseConvert(value)) : await this.client.database.guild.update(message.guild.id, setting.dbRow, setting.databaseConvert(value));

        message.channel.send(`Updated your ${setting.type.toLowerCase()} setting \`${setting.displayName}\` to \`${value}\``);
    }
}

module.exports = SettingsCommand;