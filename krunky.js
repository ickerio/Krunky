const KrunkyManager = require('./src/KrunkyManager.js');
const auth = require('./auth.json');

const Krunky = new KrunkyManager('./src/Shard/shard.js', {
    token: auth.DISCORD_TOKEN,
    production: process.argv.includes('prod'),
    statsTokens: {
        DBL: auth.DBL_TOKEN,
        BOD: auth.BOD_TOKEN
    }
});

Krunky.init();