module.exports = [
    {
        usage: 'krunkername',
        displayName: 'Krunker Name',
        type: 'User',
        dbRow: 'KrunkerName',
        description: 'Link your krunker account username to skip typing it in on the `player` command',
        valid: 'Krunker username of length less than 15 characters',
        validate: parameter => parameter.length < 15,
        databaseConvert: parameter => parameter,
        displayConvert: parameter => parameter
    },
    {
        usage: 'prefix',
        displayName: 'Server-wide Krunky Prefix',
        type: 'Guild',
        dbRow: 'Prefix',
        description: 'Change Krunky\'s prefix within this server',
        valid: 'A string of less than 5 characters with no spaces in',
        validate: parameter => parameter.length < 5 && !parameter.includes(' '),
        databaseConvert: parameter => parameter,
        displayConvert: parameter => parameter
    },
    {
        usage: 'linkinfo',
        displayName: 'Link Info Toggle',
        type: 'Guild',
        dbRow: 'LinkInfo',
        description: 'Whenever a krunker link is mentioned, Krunky will fetch its info',
        valid: 'On / Off',
        validate: parameter => parameter.toLowerCase() === 'on' || parameter.toLowerCase() === 'off',
        databaseConvert: parameter => parameter.toLowerCase() === 'on' ? 1 : 0,
        displayConvert: parameter => parameter === 1 ? 'On' : parameter === 0 ? 'Off' : undefined
    }
];