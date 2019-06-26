const fetch = require('node-fetch');

class Util {
    static log(text, options) {
        if (!options) options = { id: 'N/A', simple: false };
        // eslint-disable-next-line no-console
        console.log(options.simple ? text : `${new Date().toUTCString()} [${options.id}] - ${text}`);
    }

    static DBLpostStats(id, guildCount, token) {
        fetch(`https://discordbots.org/api/bots/${id}/stats`, {
            method: 'POST',
            body: JSON.stringify({ guild_count: guildCount }),
            headers: { Authorization: token }
        });
    }

    static BODpostStats(id, guildCount, token) {
        fetch(`https://bots.ondiscord.xyz/bot-api/bots/${id}/guilds`, {
            method: 'POST',
            body: JSON.stringify({ guildCount }),
            headers: { 
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });
    }
}

module.exports = Util;