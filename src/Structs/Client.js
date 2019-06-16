const Discord = require('discord.js');
const readdir = require('util').promisify(require('fs').readdir);
const { log } = require('../Util/Util.js');

class KrunkyClient extends Discord.Client {
    constructor(options = {}) {
        super(options);

        this.config = options.config;

        this.on('ready', this.nowReady);
        this.on('message', this.processMessage);
        this.on('error', process.exit);
    }

    nowReady() {
        log(`Logged in as ${this.user.tag}!`, this.shard);
        this.user.setActivity(...this.config.GAME);
    }

    
    processMessage(message) {
        if(message.content.startsWith(this.user.toString())) return message.reply(`**${this.config.PREFIX}** is my prefix`);
    
        // Ignore messages if statements
        if (!message.content.startsWith(this.config.PREFIX)) return;
        if (message.author.bot) return;
    
        // Extracts command and args
        const args = message.content.split(/\s+/g);
        const call = args.shift().slice(this.config.PREFIX.length).toLowerCase();
    
        // Find command and issue it
        const command = this.commands.get(call) || this.commands.get(this.alliases.get(call));
        if (!command) return;
    
        if (!command.channelTypes.includes(message.channel.type)) return;
        if (command.ownerOnly && !(this.config.OWNERS.includes(message.author.id))) return;
        
        // Translate args array to object
        const argsObj = {};
        let index = 0;
        for (const [key, value] of Object.entries(command.args)) {
            if (value.required && !args[index]) return message.reply(`wrong arguments given. Use \`${this.config.PREFIX}${command.usage}\``);
            argsObj[key] = args[index];
            index++;
        }
        argsObj._array = args;
    
        log(`Command: ${command.name} | Guild: ${message.guild ? message.guild.name : 'DM'} | Author: ${message.author.tag}`, this.shard);
        try {
            command.run(message, argsObj);
        } catch(error) {
            message.reply('an unknown error occoured running the command.');
            log(`Error running ${command.name}`);
            log(error, {simple: true });
        }
    }

    addCommand(file) {
        if(file.split('.').slice(-1)[0] !== 'js') return;

        const command = require(`../Commands/${file}`);
        const cmd = new command(this);
        
        this.commands.set(cmd.useName, cmd);
        cmd.alliases.forEach(a => this.alliases.set(a, cmd.useName));
        delete require.cache[require.resolve(`../Commands/${file}`)];
    }

    addEvent(f) {
        const eventName = f.split('.')[0];
        const event = require(`../events/${f}`);
        this.on(eventName, event.bind(null));
        delete require.cache[require.resolve(`../events/${f}`)];
    }

    async registerCommands() {
        this.commands = new Discord.Collection();
        this.alliases = new Discord.Collection();

        const files = await readdir('./src/Commands/');
        files.forEach(f => this.addCommand(f));
    }

    registerEvents() {
        readdir('./src/events/', (err, files) => {
            if(!files) return;
            files.forEach(file => this.addEvent(file));
        });
    }
    login(token) {
        super.login(token);
    }
}

module.exports = KrunkyClient;