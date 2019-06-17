module.exports = [
    {
        usage: 'username',
        displayName: 'Krunker name',
        type: 'User',
        dbRow: 'KrunkerName',
        description: 'Link your krunker account username to skip typing it in on the `player` command',
        valid: 'Your krunker username of length less than 15 characters',
        validate: (parameter) => parameter.length < 15
    },
    {
        usage: 'prefix',
        displayName: 'Bot prefix',
        type: 'Guild',
        dbRow: 'Prefix',
        description: 'Change Krunky\'s prefix within this server',
        valid: 'A string of less than 5 characters with no spaces in',
        validate: (parameter) => parameter.length < 5 && !parameter.includes(' ')
    }
];