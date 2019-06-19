const { encode, decode } = require('msgpack-lite');

class Message {
    static encode(array) {
        const encBuff = encode(array);
        return this.toArrayBuffer(encBuff);
    }

    static decode(data) {
        return decode(new Uint8Array(data));
    }

    static toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length + 2);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }
}

module.exports = Message;