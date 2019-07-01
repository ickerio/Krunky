const sqlite = require('sqlite');
const definitions = require('./Definitions.js');

class Database {
    constructor(table, key) {
        this.table = table;
        this.key = key;
        this.definitions = definitions;
        this.cache = new Map();
    }

    connect() {
        return sqlite.open('./dat/krunky.sqlite', { cache: true })
            .then(db => this.db = db);
    }

    async add(id) {
        await this.db.get(`
        INSERT OR IGNORE INTO ${this.table}(${this.key})
        VALUES (?);
        `, id);

        await this._dbGet(id);
    }

    async get(id, key) {
        if (!this.cache.has(id)) await this._dbGet(id);
        const data = this.cache.get(id);
        if (!data) return undefined;

        return data.get(key);
    }

    async update(id, key, value) {
        await this.db.get(`
        UPDATE ${this.table}
        SET ${key} = ?
        WHERE ${this.table}.${this.key} = ?;
        `, value, id);

        await this._dbGet(id);
    }

    async _dbGet(id) {
        const data = await this.db.get(`
        SELECT * FROM ${this.table}
        WHERE ${this.table}.${this.key} = ?;
        `, id);

        if (!data) return;
        await this.cache.set(id, new Map(Object.entries(data)));
    }
}

module.exports = Database;