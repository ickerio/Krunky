const CacheItem = require('./CacheItem.js');

class Cache {
    constructor(maxTime) {
        this.maxTime = maxTime;
        this.map = new Map();
    }
    
    get(key) {
        return this.map.get(key).value;
    }

    set(key, value) {
        if (this.map.has(key)) clearTimeout(this.map.get(key).timeout);
        return this.map.set(key, new CacheItem(key, value, this));
    }

    has(key) {
        return this.map.has(key);
    }
}

module.exports = Cache;