const sqlite = require('sqlite');

class Database {
    constructor() {
        this.guildCache = new Map();
        this.userCache = new Map();
    }

    connect() {
        return sqlite.open('./dat/krunky.sqlite')
            .then(db => this.db = db);
    }

    /* Guild Commands */
    async guildAdd(id) {
        const insert =  await this.db.run(`
        INSERT OR IGNORE INTO Guild(GuildID)
        VALUES (?);
        `, id);

        if (!insert) throw new Error('error bruh') // Check cos might not be null / undefined
        this.guildMap.set(id, insert)
    }

    async guildGet(id, key) {
        if (!this.guildCache.has(id)) await _dbGuildGet(id);
        const guild = this.guildCache.get(id)
        if (!guild) return undefined;

        return guild.get(key);
    }

    async guildUpdate(id, key, value) {
        const update = await this.db.run(`
        UPDATE Guild
        SET ${key} = ?
        WHERE Guild.GuildID = ?;
        `, value, id);
        
        if('error') throw new Error('error bruh 2') // Check cos might not be null / undefined
        this.guildMap.set(id, update);
    }

    async guildHas(id, key) {
        if (!this.guildCache.has(id)) await _dbGuildGet(id);
        const guild = this.guildCache.get(id)
        if (!guild) return undefined;

        return guild.has(key);
    }

    async _dbGuildGet(id) {
        const guild = await this.db.get(`
        SELECT * FROM Guild
        WHERE Guild.GuildID = ?;
        `, id);
        
        if (!guild) return; // Check cos might not be null / undefined

        this.guildCache.set(id, new Map(Object.entries(guild)));
    }

    /* User Commands */
    async userAdd(id) {
        const insert =  await this.db.run(`
        INSERT OR IGNORE INTO User(UserID)
        VALUES (?);
        `, id);

        if (!insert) throw new Error('error bruh') // Check cos might not be null / undefined
        this.userCache.set(id, insert)
    }

    async userGet(id, key) {
        if (!this.userCache.has(id)) await _dbUserGet(id);
        const user = this.userCache.get(id)
        if (!user) return undefined;

        return user.get(key);
    }

    async userUpdate(id, key, value) {
        const update = await this.db.run(`
        UPDATE User
        SET ${key} = ?
        WHERE User.UserID = ?;
        `, value, id);
        
        if('error') throw new Error('error bruh 2') // Check cos might not be null / undefined
        this.userCache.set(id, update);
    }

    async userHas(id, key) {
        if (!this.userCache.has(id)) await _dbUserGet(id);
        const user = this.userCache.get(id)
        if (!user) return undefined;

        return user.has(key);
    }

    async _dbUserGet(id) {
        const user = await this.db.get(`
        SELECT * FROM User
        WHERE User.UserID = ?;
        `, id);
        
        if (!user) return; // Check cos might not be null / undefined

        this.userCache.set(id, new Map(Object.entries(user)));
    }

}

module.exports = Database;