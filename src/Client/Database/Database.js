const sqlite = require('sqlite');
const definitions = require('./Definitions.js');

class Database {
    constructor() {
        this.definitions = definitions;
        this.guildCache = new Map();
        this.userCache = new Map();
    }

    connect() {
        return sqlite.open('./dat/krunky.sqlite')
            .then(db => this.db = db);
    }

    /* User Commands */
    async userAdd(id) {
        await this.db.get(`
        INSERT OR IGNORE INTO User(UserID)
        VALUES (?);
        `, id);

        await this._dbUserGet(id);
    }

    async userGet(id, key) {
        if (!this.userCache.has(id)) await this._dbUserGet(id);
        const user = this.userCache.get(id);
        if (!user) return undefined;

        return user.get(key);
    }

    async userUpdate(id, key, value) {
        await this.db.get(`
        UPDATE User
        SET ${key} = ?
        WHERE User.UserID = ?;
        `, value, id);

        await this._dbUserGet(id);
    }

    async _dbUserGet(id) {
        const user = await this.db.get(`
        SELECT * FROM User
        WHERE User.UserID = ?;
        `, id);

        if (!user) return; // Check cos might not be null / undefined
        await this.userCache.set(id, new Map(Object.entries(user)));
    }

    /* Guild Commands */
    async guildAdd(id) {
        await this.db.get(`
        INSERT OR IGNORE INTO Guild(GuildID)
        VALUES (?);
        `, id);

        await this._dbGuildGet(id);
    }

    async guildGet(id, key) {
        if (!this.guildCache.has(id)) await this._dbGuildGet(id);
        const guild = this.guildCache.get(id);
        if (!guild) return undefined;

        return guild.get(key);
    }

    async guildUpdate(id, key, value) {
        await this.db.get(`
        UPDATE Guild
        SET ${key} = ?
        WHERE Guild.GuildID = ?;
        `, value, id);

        await this._dbGuildGet(id);
    }

    async _dbGuildGet(id) {
        const guild = await this.db.get(`
        SELECT * FROM Guild
        WHERE Guild.GuildID = ?;
        `, id);

        if (!guild) return; // Check cos might not be null / undefined
        await this.guildCache.set(id, new Map(Object.entries(guild)));
    }

}

module.exports = Database;