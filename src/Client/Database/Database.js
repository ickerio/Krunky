const sqlite = require('sqlite');

const settings = require('./settings.js');

class Database {
    constructor() {
        this.init();
        this.settings = settings;
    }

    init(){
        sqlite.open('./dat/krunky.sqlite')
            .then(db => this.db = db);
    }

    addUser(id) {
        this.db.run(`
        INSERT OR IGNORE INTO User (UserID)
        VALUES (${id});
        `);
    }

    getUser(id) {
        return this.db.run(`
        SELECT * FROM User
        WHERE User.UserID = '${id}';
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