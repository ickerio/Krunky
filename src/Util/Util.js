const fetch = require('node-fetch');

class Util {
    static log(text, options) {
        if (!options) options = { id: 'N/A', simple: false };
        // eslint-disable-next-line no-console
        console.log(options.simple ? text : `${new Date().toUTCString()} [${options.id}] - ${text}`);
    }

    static postStats(id, shards, token) {
        return fetch(`https://discordbots.org/api/bots/${id}/stats`, {
            method: 'POST',
            body: JSON.stringify({ shards }),
            headers: { Authorization: token }
        });
    }
}

module.exports = Util;