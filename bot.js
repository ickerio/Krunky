const KrunkyBot = require('./src/Structs/Client.js');

const client = new KrunkyBot({
    config: require('./config.json'),
    disabledEvents: [
        'TYPING_START'
    ],
    messageCacheLifetime: 60,
    messageSweepInterval: 60
});

client.registerCommands();
client.registerEvents();

client.login(client.config.TOKEN);