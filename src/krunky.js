const Discord = require('discord.js');
const config = require('../config.json');
const { log, DBLpostStats, BODpostStats } = require('./Util/Util.js');

const manager = new Discord.ShardingManager('./src/shard.js', {
    token: config.TOKEN,
    shardArgs: [config.TOKEN]
});

log(`Krunky starting with ${manager.totalShards} shards`, { id: 'M' });

manager.on('launch', s => log('Launched', s));

manager.spawn().then(() => checkReady());

async function checkReady() {
    const values = await manager.fetchClientValues('readyAt');
    const allReady = values.every(r => r !== null);
    if (allReady) {
        postInterval();
    } else {
        setTimeout(() => checkReady(), 5000);
    }
}

async function postInterval() {
    const shards = await manager.fetchClientValues('guilds.size');
    const guildCount = shards.reduce((prev, count) => prev + count, 0);
    await DBLpostStats(config.ID, shards, config.DBL_TOKEN);
    await BODpostStats(config.ID, guildCount, config.BOD_TOKEN);
    setTimeout(() => postInterval(), 1000 );
}