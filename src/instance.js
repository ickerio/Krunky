const Krunky = require('./Client/Client.js');

const client = new Krunky({
    config: require('../config.json'),
    disabledEvents: [
        'TYPING_START'
    ],
    messageCacheLifetime: 60,
    messageSweepInterval: 60
});

client.registerCommands();
client.registerEvents();

client.login(process.argv[2]);