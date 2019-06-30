const fetch = require('node-fetch');

const fetchInterval = 60 * 1000;

class Matchmaker {
    constructor(client) {
        this.client = client;
        this.onInterval();
        this.matchInterval = setInterval(this.onInterval.bind(this), fetchInterval);
    }

    async getMatch(id) {
        const data = await fetch(`https://matchmaker.krunker.io/game-info?game=${id}`);
        const json = await data.json();
        if (json.error) throw new Error('Invalid game link');
        return json;
    }

    async onInterval() {
        const matches = await this.fetchMatches();
        this.stats = this.getStats(matches);
    }

    async fetchMatches() {
        const data = await fetch('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
        return await data.json();
    }

    async getStats(matches) {
        const stats = {
            players: 0,
            matches: matches.length,
            regions: {},
            maps: new Map()
        };

        for (const [key] of Object.entries(this.client.constants.regionNames)) {
            stats.regions[key] = { players: 0, matches: 0 };
        }

        matches.forEach(match => {
            stats.players += match.clients;

            stats.regions[match.region].players += match.clients;
            stats.regions[match.region].matches ++;

            const current = stats.maps.has(match.data.i) ? stats.maps.get(match.data.i) : { players: 0, matches: 0 };
            current.players += match.clients;
            current.matches ++;
            stats.maps.set(match.data.i, current);
        });

        return stats;
    }
}

module.exports = Matchmaker;