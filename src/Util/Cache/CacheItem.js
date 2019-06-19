class CacheItem {
    constructor(key, value, cache) {
        this.key = key;
        this.value = value;
        this.timeout = setTimeout(() => cache.map.delete(key), cache.maxTime);
    }
}

module.exports = CacheItem;