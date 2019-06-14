class Util {
    static clean (text, token)  {
        if (typeof (text) === 'string')
            return text
                .replace(token, '[TOKEN]')
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203));
        else return text;
    }
}

module.exports = Util;