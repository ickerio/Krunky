const sqlite = require('sqlite');

const settings = require('./settings.js');

class Database {
    constructor() {
        this.settings = settings;
    }

    connect(){
        return sqlite.open('./dat/krunky.sqlite', { cached: true })
            .then(db => this.db = db);
    }

    addUser(id) {
        return this.db.run(`
        INSERT OR IGNORE INTO User (UserID)
        VALUES (?);
        `, id);
    }

    addGuild(id) {
        return this.db.run(`
        INSERT OR IGNORE INTO Guild (GuildID)
        VALUES (${id});
        `);
    }

    setSetting(id, key, value) {
        const setting = this.settings.find(set => set.usage === key);

        return this.db.run(`
        UPDATE ${setting.type}
        SET ${setting.dbRow} = ?
        WHERE ${setting.type}.${setting.type + 'ID'} = '${id}';
        `, value);
    }

    async getSetting(id, key) {
        const setting = this.settings.find(set => set.usage === key);

        const data = await this.db.get(`
        SELECT ${setting.dbRow} FROM ${setting.type}
        WHERE ${setting.type}.${setting.type + 'ID'} = '${id}';
        `);

        return data[setting.dbRow];
    }
}

module.exports = Database;