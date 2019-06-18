const fetch = require('node-fetch');

//const fetchInterval = 60 * 1000;

class Matchmaker {
    constructor() {
        //this.matchInterval = setInterval(async () => await this.fetchMatches(), fetchInterval);
        this.matches;
    }

    async getMatch(id) {
        const data = await fetch(`https://matchmaker.krunker.io/game-info?game=${id}`);
        const json = await data.json();
        if (json.error) throw new Error('Invalid game link');
        return json;
    }

    async fetchMatches() {
        const data = await fetch('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
        this.matches = await data.json();
    }
}

module.exports = Matchmaker;