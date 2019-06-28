const { Client } = require('discord.js');
const CommandHandler = require('./CommandHandler.js');
const EventHandler = require('./EventHandler.js')
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

        this.constants = Constants;
        this.database = new Database();
        this.matchmaker = new Matchmaker(this);
        this.renderer = new Renderer();
        this.social = new Social();

        this.commandHandler = new CommandHandler(this, {
            prefix: '!kr ',
            directory: './src/Commands/',
            ignoreRatelimit: [],
            oweners: [],
            allowMention: true
        });

        this.eventHandler = new EventHandler(this, {
            directory: './src/Events/'
        });

        this.on('ready', this.nowReady);
        this.on('error', process.exit);
    }

    nowReady() {
        log(`Logged in as ${this.user.tag}!`, this.shard);
        this.user.setActivity(...this.config.GAME);
    }
    
    async login(token) {
        await this.database.connect();
        this.commandHandler.init();
        this.eventHandler.init();
        super.login(token);
    }
}

module.exports = KrunkyClient;