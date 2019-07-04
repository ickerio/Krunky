const Discord = require('discord.js');
const CommandHandler = require('./CommandHandler.js');
const EventHandler = require('./EventHandler.js');

const Logger = require('../../Util/Logger.js');

const Database = require('../../Providers/Database/Database.js');
const Matchmaker = require('../../Providers/Matchmaker/Matchmaker.js');
const Renderer = require('../../Providers/Renderer/Renderer.js');
const Social = require('../../Providers/Social/Social.js');

class KrunkyShard extends Discord.Client {
    constructor(options = {}) {
        super(options);

        this.database =  {
            user: new Database({ table: 'User', key: 'UserID' }),
            guild: new Database({ table: 'Guild', key: 'GuildID' })
        };
        this.constants = options.constants;
        this.matchmaker = new Matchmaker(this);
        this.renderer = new Renderer();
        this.social = new Social();

        this.commandHandler = new CommandHandler(this, options.commandHandler);
        this.eventHandler = new EventHandler(this, options.eventHandler);

        this.on('ready', this.ready);
        this.on('error', this.error);
    }

    ready() {
        Logger.login(this.user.tag, this.shard.id);
        this.user.setActivity(...this.options.game);
    }

    error(error) {
        Logger.error(error);
    }
    
    async login(token) {
        await this.database.user.connect();
        await this.database.guild.connect();
        this.commandHandler.init();
        this.eventHandler.init();
        super.login(token);
    }
}

module.exports = KrunkyShard;