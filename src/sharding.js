const Discord = require('discord.js');
const config = require('../config.json');
const { log } = require('./Util/Util.js');

const manager = new Discord.ShardingManager('./src/instance.js', {
    token: config.TOKEN,
    shardArgs: [config.TOKEN]
});

log(`Krunky starting with ${manager.totalShards} shards`, { id: 'M' });

manager.on('launch', s => log('Launched', s));

manager.spawn();