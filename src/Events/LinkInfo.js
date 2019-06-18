const { RichEmbed } = require('discord.js');

async function info(message) {
    const reg = message.content.match(/(krunker\.io\/\?game=)([a-zA-Z]{2,3}:[a-zA-Z0-9]{5})+/);
    if (!reg) return;

    const setting = message.channel.type == 'text' ?  await this.database.getSetting(message.guild.id, 'linkinfo') : true;
    if (!setting) return;

    const match = await this.matchmaker.getMatch(reg[2]);

    const desc = [
        `Players: ${match.clients}/${match.maxClients}${match.clients === match.maxClients ? ' (**Full**)' : ''}`,
        `Map: ${match.data.i}`,
        `Custom: ${match.data.cs ? 'Yes' : 'No'}`
    ].join('\n');

    const embed = new RichEmbed()
        .setAuthor(`Match ${match.id}`, this.constants.embedImages.embedHeader, `https://krunker.io/?game=${match.id}`)
        .setDescription(desc)
        .setColor(this.constants.embedColour);

    message.channel.send(embed);
}

module.exports = [{ name: 'message', func: info }];