const Discord = require('discord.js');
const config = require('./config.json');

const manager = new Discord.ShardingManager('./src/index.js', {
    token: config.TOKEN,
    shardArgs: [config.TOKEN]
});

console.log(`${new Date().toUTCString()} [M] - MortyBot starting with ${manager.totalShards} shards`);

manager.on('launch', s => {
    console.log(`${new Date().toUTCString()} [${s.id}] - Launched!`);
});

manager.spawn();