const Krunky = require('./Client/Client.js');

const client = new Krunky({
    owners: ['507173409159905280', '224452565608300544'],
    game: ['Krunker.io', { type: 'PLAYING' }],
    commandHandler: {
        prefix: '!kr ',
        directory: './src/Commands/',
        ignoreRatelimit: [],
        oweners: [],
        allowMention: true
    },
    eventHandler: {
        directory: './src/Events/'
    }
});

client.login();