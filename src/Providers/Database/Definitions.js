module.exports = {
    User: [
        {
            name: 'KrunkerName',
            validate: parameter => parameter.length < 15,
            databaseConvert: parameter => parameter,
            displayConvert: parameter => parameter
        }
    ],
    Guild: [
        {
            name: 'Prefix',
            validate: parameter => parameter.length < 5,
            databaseConvert: parameter => parameter,
            displayConvert: parameter => parameter
        },
        {
            name: 'LinkInfo',
            validate: parameter => parameter.toLowerCase() === 'on' || parameter.toLowerCase() === 'off',
            databaseConvert: parameter => parameter.toLowerCase() === 'on' ? 1 : 0,
            displayConvert: parameter => parameter === 1 ? 'On' : parameter === 0 ? 'Off' : undefined
        }
    ]
};