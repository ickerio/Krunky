class Util {
    static log(text, options) {
        if (!options) options = { id: 'N/A', simple: false };
        // eslint-disable-next-line no-console
        console.log(options.simple ? text : `${new Date().toUTCString()} [${options.id}] - ${text}`);
    }
}

module.exports = Util;