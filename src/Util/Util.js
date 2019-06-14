class Util {
    static clean (text, token)  {
        if (typeof (text) === 'string')
            return text
                .replace(token, '[TOKEN]')
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203));
        else return text;
    }

    static log(text, options) {
        if (!options) options = { id: 'N/A', simple: false };
        // eslint-disable-next-line no-console
        console.log(options.simple ? text : `${new Date().toUTCString()} [${options.id}] - ${text}`);
    }
}

module.exports = Util;