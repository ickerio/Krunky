const Discord = require('discord.js');
const CommandHandler = require('./CommandHandler.js');
const EventHandler = require('./EventHandler.js');

const Logger = require('../Util/Logger.js');
const Constants = require('../Util/Constants.js');

const Database = require('./Database/Database.js');
const Matchmaker = require('./Matchmaker/Matchmaker.js');
const Renderer = require('./Renderer/Renderer.js');
const Social = require('./Social/Social.js');

class KrunkyClient extends Discord.Client {
    constructor(options = {}) {
        super(options);

        this.constants = Constants;
        this.database = new Database();
        this.matchmaker = new Matchmaker(this);
        this.renderer = new Renderer();
        this.social = new Social();

        this.commandHandler = new CommandHandler(this, options.commandHandler);
        this.eventHandler = new EventHandler(this, options.eventHandler);

        this.on('ready', this.ready);
        this.on('error', this.error);
    }

    ready() {
        Logger.login(this.user.tag);
        this.user.setActivity(...this.options.game);
    }

    error(error) {
        Logger.error(error);
    }
    
    async login(token) {
        await this.database.connect();
        this.commandHandler.init();
        this.eventHandler.init();
        super.login(token);
    }
}

module.exports = KrunkyClient;