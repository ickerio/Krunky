const Matchmaker = require('../Client/Matchmaker/Matchmaker.js');

const matchmaker = new Matchmaker();

async function detailer(message) {
    const reg = message.content.match(/(krunker\.io\/\?game=)([a-zA-Z]{2,3}:[a-zA-Z0-9]{5})+/);
    if (!reg) return;

    const data = await matchmaker.getMatch(reg[2]);
    message.channel.send(JSON.stringify(data));
}

module.exports = [ 'message', detailer ];