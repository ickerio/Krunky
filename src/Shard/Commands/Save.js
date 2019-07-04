const Command = require('../Structs/Command.js');

class SaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Save',
            useName: 'save',
            description: 'Save your krunker in game name to your account',
            args: { name: { required: true }},
            type: 'Utility',
            usage: 'save <your krunker name>',
            alliases: [],
            uses: 5,
            cooldown: 60 * 1000,
            ownerOnly: false,
            channelTypes: [ 'text' ]
        });
    }

    async run(message, { name }) {
        const validation = this.client.database.user.definitions.find(d => d.name === 'KrunkerName').validate(name);
        if (!validation) return message.channel.send('Error. Prefix must be less than 15 characters');

        this.client.database.user.update(message.author.id, 'KrunkerName', name);
        message.channel.send('Succesfully updated your krunker in game name');
    }
}

module.exports = SaveCommand;