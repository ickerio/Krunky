const RequestQueue = require('./SocialRequest.js');

class Social {
    constructor() {
        this.playerQueue = new RequestQueue();
    }

    getUser(user) {
        return this.getRawUser(user)
            .then(d => this.simplifyUser(d));
    }

    getRawUser(user) {
        const data = { endpoint: 'profile', query: user };
        return new Promise((resolve, reject) => this.playerQueue.addRequest(data, resolve, reject));
    }

    getRawLeaderboard(type) {
        return new Promise((resolve, reject) => {
            if (!['score', 'kills', 'timeplayed', 'funds', 'clan'].includes(type)) return reject('not a valid type');
            const data = { endpoint: 'leaders', query: type };
            this.playerQueue.addRequest(data, resolve, reject);
        });
    }

    getPlayTime(data) {
        let str = '';
        const minutes = Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) % 60;
        const hours = Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) % 24;
        const days = Math.floor(Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) / 24);
        if (days) str += `${days}d `;
        if (hours) str += `${hours}h `;
        if (minutes) str += `${minutes}m`;
        return str;
    }

    simplifyUser(data) {
        return {
            name: data.player_name,
            id: data.player_id,
            score: data.player_score,
            level: Math.max(1, Math.floor(0.03 * Math.sqrt(data.player_score))),
            kills: data.player_kills,
            deaths: data.player_deaths,
            kdr: (data.player_kills / data.player_deaths || 0).toFixed(2),
            spk: (data.player_score / data.player_kills || 0).toFixed(2),
            totalGamesPlayed: data.player_games_played,
            wins: data.player_wins,
            loses: data.player_games_played - data.player_wins,
            wl: (data.player_wins / data.player_games_played || 0).toFixed(2),
            playTime: this.getPlayTime(data),
            krunkies: data.player_funds,
            clan: data.player_clan ? data.player_clan : 'No Clan',
            featured: data.player_featured ? data.player_featured : 'No',
            hacker: data.player_hack ? data.player_hack : 'No'
        };
    }
}

module.exports = Social;