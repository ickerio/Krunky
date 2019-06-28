const Krunky = require('./Client/Client.js');
const config = require('../config.json');

const client = new Krunky({
    config,
    disabledEvents: [
        'TYPING_START'
    ],
    messageCacheLifetime: 60,
    messageSweepInterval: 60
});

client.login(process.argv[2] || config.TOKEN);