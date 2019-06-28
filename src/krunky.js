const Discord = require('discord.js');
const fetch = require('node-fetch');
const auth = require('../auth.json');
const Logger = require('./Util/Logger.js');

class KrunkyManager extends Discord.ShardingManager{
    constructor(file, options) {
        super(file, options);
        Logger.startup(this.totalShards);

        this.on('launch', this.shardLaunch.bind(this));
    }

    shardLaunch(shard) {
        Logger.launch(shard);
    }

    async checkReady() {
        const values = await this.fetchClientValues('readyAt');
        const allReady = values.every(r => r !== null);
        if (allReady) {
            this.postStats();
        } else {
            setTimeout(() => this.checkReady(), 5000);
        }
    }

    async postStats(id = auth.BOT_ID) {
        const shards = await this.fetchClientValues('guilds.size');
        const guildCount = shards.reduce((prev, count) => prev + count, 0);

        fetch(`https://discordbots.org/api/bots/${id}/stats`, {
            method: 'POST',
            body: JSON.stringify({ guild_count: guildCount }),
            headers: { Authorization: auth.DBL_TOKEN }
        });

        fetch(`https://bots.ondiscord.xyz/bot-api/bots/${id}/guilds`, {
            method: 'POST',
            body: JSON.stringify({ guildCount }),
            headers: { 
                Authorization: auth.BOD_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        setTimeout(() => this.postStats(), 1.8e+6 );
    }

    init() {
        super.spawn()
            .then(this.checkReady.bind(this));
    }
}

const Krunky = new KrunkyManager('./src/shard.js', {
    token: auth.DISCORD_TOKEN,
});

Krunky.init();