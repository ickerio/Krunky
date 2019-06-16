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
        INSERT INTO User (UserID)
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
        SET ${setting.dbRow} = '${value}';
        WHERE ${setting.type}.${setting.type + 'ID'} = '${id}'
        `);
    }

    getSetting(id, key) {
        const setting = this.settings.find(set => set.usage === key);

        return this.db.get(`
        SELECT ${key} FROM ${setting.type}
        WHERE ${setting.type}.${setting.type + 'ID'} = '${id}';
        `);
    }
}

module.exports = Database;