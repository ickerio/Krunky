const Matchmaker = require('../Client/Matchmaker/Matchmaker.js');
const { RichEmbed } = require('discord.js');

const matchmaker = new Matchmaker();

async function detailer(message) {
    const reg = message.content.match(/(krunker\.io\/\?game=)([a-zA-Z]{2,3}:[a-zA-Z0-9]{5})+/);
    if (!reg) return;

    const setting = message.channel.type == 'text' ?  await message.client.database.getSetting(message.guild.id) : true;
    if (!setting) return;

    const match = await matchmaker.getMatch(reg[2]);

    const desc = [
        `Players: ${match.clients}/${match.maxClients}`,
        `Map: ${match.data.i}`,
    ].join('\n');

    const embed = new RichEmbed()
        .setAuthor(`Match ${match.id}`, message.client.constants.embedImages.embedHeader, `https://${reg[1]}`)
        .setDescription(desc)
        .setColor(message.client.constants.embedColour);

    message.channel.send(emebd);
}

module.exports = [ 'message', detailer ];