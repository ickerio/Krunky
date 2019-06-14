if (process.argv.includes('sharding')) {
    require('./src/sharding');
} else {
    process.argv[2] = require('./config.json').TOKEN;
    require('./src/instance.js');
}