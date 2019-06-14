const { clean } = require('../Util/Util.js');
const Command = require('../Structs/Command.js');

class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Eval',
            useName: 'eval',
            description:  'Evaluates some JavaScript',
    
            type: 'Owner',
            usage: 'eval <code>',
            alliases: [],
            ownerOnly: true,
            channelTypes: ['dm', 'group', 'text']
        });
    }
    async run(message, args) {
        try {
            let evaled = await eval(args.join(' '));
            
            if (!args.length) return;
        
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled, {depth: 0});
        
            let m = `\`\`\`js\n${clean(evaled, this.client.token)}\n\`\`\``;
            if (m.length > 2000) {
                m = `Output was too long... ${evaled.length} characters!`;
            }
        
            message.channel.send(m);
        } catch (err) {
            message.channel.send(`\`\`\`js\n${clean(err, this.client.token)}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand;