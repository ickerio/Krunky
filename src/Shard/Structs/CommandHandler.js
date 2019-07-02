const { Collection } = require('discord.js');
const Logger = require('../../Util/Logger.js');
const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(client, options = {}) {
        this.client = client;
        this.options = options;
    }

    init() {
        this.commands = new Collection();
        this.alliases = new Collection();

        this.registerCommands();
        this.client.on('message', this.handle.bind(this));
    }

    registerCommands() {
        const files = fs.readdirSync(this.options.directory);
        const filepaths = files.map(f => path.resolve(`${this.options.directory}${f}`));
        filepaths.forEach(f => this.addCommand(f));
    }

    addCommand(file) {
        if(file.split('.').slice(-1)[0] !== 'js') return;
        
        const Command = require(file);
        const cmd = new Command(this.client);
        
        this.commands.set(cmd.useName, cmd);
        cmd.alliases.forEach(a => this.alliases.set(a, cmd.useName));
        delete require.cache[require.resolve(file)];
    }

    async handle(message) {
        if (message.author.bot) return;

        const prefix = await this.findPrefix(message);
        if (!prefix) return;
    
        const [ call, args ] = this.extractDetails(message, prefix.used);
    
        const command = this.findCommand(call);
        if (!command) return;

        if (this.shouldIgnoreCommand(command, message)) return;

        const ratelimit = this.doRateLimiting(command, message.author.id);
        if (ratelimit) {
            return message.channel.send(`Error. You are being ratelimited, wait ${(ratelimit / 1000).toFixed(1)}s for ${command.uses} more uses`);
        }

        const argsObj = this.getArgumentsObject(args, command);
        if (!argsObj) {
            return message.channel.send(`Error. Wrong arguments given, use ${prefix.desired}${command.usage}`);
        }

        message.prefix = prefix;
    
        try {
            Logger.command(message, command, this.client.shard.id);
            command.run(message, argsObj);
        } catch(error) {
            message.channel.send('Error. Something went seriously wrong executing that command');
        }
    }

    async findPrefix(message) {
        if (!message.guild) {
            const defaultPref = this.parseLongPrefix(this.options.prefix);
            return { used: defaultPref, desired: defaultPref };
        }

        const desired = this.parseLongPrefix(await this.client.database.guild.get(message.guild.id, 'Prefix'));
        const me = this.parseLongPrefix(this.client.user.toString());

        if (message.content.startsWith(me) && this.options.allowMention) {
            return { used: me, desired };
        } else if (message.content.startsWith(desired)) {
            return { used: desired, desired };
        } else {
            return;
        }
    }

    parseLongPrefix(prefix) {
        return prefix.length > 1 ? `${prefix} ` : prefix; 
    }

    extractDetails(message, prefix) {
        if (prefix.length > 1) {
            const args = message.content.replace(prefix, '').split(/\s+/g);
            const call = args.shift().toLowerCase();
            return [call, args];
        } else {
            const args = message.content.split(/\s+/g);
            const call = args.shift().slice(1).toLowerCase();
            return [call, args];
        }
    }

    findCommand(call) {
        return this.commands.get(call) || this.commands.get(this.alliases.get(call));
    }

    shouldIgnoreCommand(command, message) {
        return !command.channelTypes.includes(message.channel.type) || (command.ownerOnly && !this.options.owners.includes(message.author.id));
    }

    doRateLimiting(command, authorId) {
        if (this.options.ignoreRatelimit.includes(authorId)) return false;
        const now = new Date().getTime();
        const limit = command.ratelimit.get(authorId);
        if (!limit || now > limit.expiry) {
            command.ratelimit.set(authorId, { uses: command.uses - 1, expiry: now + command.cooldown });
            return false;
        } else if (limit.uses === 0) {
            return limit.expiry - now;
        } else {
            limit.uses -= 1;
            command.ratelimit.set(authorId, limit);
            return false;
        }
    }

    getArgumentsObject(args, command) {
        const argsObj = {};
        let index = 0;
        for (const [key, value] of Object.entries(command.args)) {
            if (value.required && !args[index]) return false;
            argsObj[key] = args[index];
            index++;
        }
        argsObj._array = args;
        return argsObj;
    }
}

module.exports = CommandHandler;