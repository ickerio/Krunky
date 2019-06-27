const { Client } = require('discord.js');
const readdir = require('util').promisify(require('fs').readdir);
const CommandHandler = require('./CommandHandler.js');
const { log } = require('../Util/Util.js');

const Constants = require('../Util/Constants.js');
const Database = require('./Database/Database.js');
const Matchmaker = require('./Matchmaker/Matchmaker.js');
const Renderer = require('./Renderer/Renderer.js');
const Social = require('./Social/Social.js');

class KrunkyClient extends Client {
    constructor(options = {}) {
        super(options);
        this.config = options.config;

        this.commandHandler = new CommandHandler(this);

        this.on('ready', this.nowReady);
        this.on('error', process.exit);
    }

    nowReady() {
        log(`Logged in as ${this.user.tag}!`, this.shard);
        this.user.setActivity(...this.config.GAME);

        this.constants = Constants;
        this.database = new Database();
        this.matchmaker = new Matchmaker(this);
        this.renderer = new Renderer();
        this.social = new Social();
    }


    addEvent(f) {
        const event = require(`../Events/${f}`);
        event.forEach(ev => this.on(ev.name, ev.func.bind(this)));
        delete require.cache[require.resolve(`../Events/${f}`)];
    }

    registerEvents() {
        readdir('./src/Events/', (err, files) => {
            if(!files) return;
            files.forEach(file => this.addEvent(file));
        });
    }
    
    login(token) {
        super.login(token);
    }
}

module.exports = KrunkyClient;