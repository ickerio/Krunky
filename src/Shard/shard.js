const KrunkyShard = require('./Structs/KrunkyShard.js');

const owners = ['507173409159905280', '224452565608300544'];

const client = new KrunkyShard({
    owners,
    game: ['Krunker.io', { type: 'PLAYING' }],
    commandHandler: {
        prefix: '!kr ',
        directory: './src/Shard/Commands/',
        ignoreRatelimit: [],
        owners,
        allowMention: true
    },
    eventHandler: {
        directory: './src/Shard/Events/'
    },
    constants: require('../Util/Constants.js')
});

client.login();