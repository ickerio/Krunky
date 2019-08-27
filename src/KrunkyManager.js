const Discord = require('discord.js');
const fetch = require('node-fetch');
const Logger = require('./Util/Logger.js');

class KrunkyManager extends Discord.ShardingManager{
    constructor(file, options) {
        super(file, options);

        this.production = options.production;
        this.statsTokens = options.statsTokens;
        this.userId = undefined;

        Logger.startup(this.totalShards);
        this.on('launch', this.shardLaunch.bind(this));
    }

    shardLaunch(shard) {
        Logger.launch(shard.id);
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

    async postStats() {
        if (!this.userId) {
            const userIds = await this.fetchClientValues('user.id');
            this.userId = userIds[0];
        }

        const shards = await this.fetchClientValues('guilds.size');
        const guildCount = shards.reduce((prev, count) => prev + count, 0);

        fetch(`https://discordbots.org/api/bots/${this.userId}/stats`, {
            method: 'POST',
            body: JSON.stringify({ server_count: guildCount }),
            headers: { 
                Authorization: this.statsTokens.DBL_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        fetch(`https://bots.ondiscord.xyz/bot-api/bots/${this.userId}/guilds`, {
            method: 'POST',
            body: JSON.stringify({ guildCount }),
            headers: { 
                Authorization: this.statsTokens.BOD_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        setTimeout(() => this.postStats(), 1.8e+6 );
    }

    async init() {
        await super.spawn();
        if (this.production) 
            this.checkReady();
    }
}

module.exports = KrunkyManager;