class CacheItem {
    constructor(key, value, map, maxTime) {
        this.key = key;
        this.value = value;
        this.timeout = setTimeout(() => map.delete(key), maxTime);
    }
}

module.exports = CacheItem;