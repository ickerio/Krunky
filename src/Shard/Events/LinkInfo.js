const { RichEmbed } = require('discord.js');
const Cache = require('../../Util/Cache/Cache.js');

const cache = new Cache(5 * 1000);

async function info(message) {
    if (message.author.bot) return;
    
    const reg = message.content.match(/(krunker\.io\/\?game=)([a-zA-Z]{2,3}:[a-zA-Z0-9]{5})+/);
    if (!reg) return;

    const setting = message.channel.type == 'text' ?  await this.database.guildGet(message.guild.id, 'LinkInfo') : true;
    if (!setting) return;

    if (cache.has(reg[2].toLowerCase())) return message.channel.send(cache.get(reg[2].toLowerCase()));

    try {
        const match = await this.matchmaker.getMatch(reg[2]);

        const desc = [
            `Region: ${this.constants.regionNames[match.region]}`,
            `Players: ${match.clients}/${match.maxClients}${match.clients === match.maxClients ? ' (**Full**)' : ''}`,
            `Map: ${match.data.i}`,
            `Custom: ${match.data.cs ? 'Yes' : 'No'}`
        ].join('\n');
    
        const embed = new RichEmbed()
            .setAuthor(`Match ${match.id}`, this.constants.embedImages.embedHeader, `https://krunker.io/?game=${match.id}`)
            .setDescription(desc)
            .setColor(this.constants.embedColour);
    
        cache.set(match.id.toLowerCase(), embed);
        message.channel.send(embed);
    } catch (error) {
        message.channel.send('An error occurred getting that game\'s info');
    }
}

module.exports = [{ name: 'message', func: info }];