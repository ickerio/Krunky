const RequestQueue = require('./SocialRequest.js');

class Social {
    constructor() {
        this.queue = new RequestQueue();
        this.boardsAlias = this.createAliasMap();
    }

    getUser(user) {
        return this._getRawUser(user)
            .then(u => this.structureUser(u[1][2]));
    }

    async getLeaderboard(alias) {
        const board = this.boardsAlias.get(alias);
        if (!board) throw new Error('Leaderboard type does not exist');

        const raw = await this._getRawLeaderboard(board)
        return this.structureLeaderboard(b[1][2])
    }

    _getRawUser(user) {
        const data = { endpoint: 'profile', query: user };
        return new Promise((resolve, reject) => this.queue.addRequest(data, resolve, reject));
    }

    _getRawLeaderboard(board) {
        const data = { endpoint: 'leaders', query: board };
        return new Promise((resolve, reject) => this.queue.addRequest(data, resolve, reject));
    }

    structureLeaderboard(data) {
        const structuredData = [];
        for (const user in data) {
            structuredData.push({
                name: user.player_name,
                featured: user.player_featured ? 'Yes' : 'No',
                clan: user.player_clan ? user.player_clan : 'No Clan',
                score: user.player_score, // May have to change this to attribute = score || krunkies || kills etc
                hacker: user.player_hack ? user.player_hack : 'No'
            })
        }
    }

    structureUser(data) {
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
            wl: (data.player_wins / (data.player_games_played - data.player_wins) || 0).toFixed(2), 
            playTime: this.getPlayTime(data),
            krunkies: data.player_funds,
            clan: data.player_clan ? data.player_clan : 'No Clan',
            featured: data.player_featured ? 'Yes' : 'No',
            hacker: data.player_hack ? data.player_hack : 'No'
        };
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

    createAliasMap() {
        const alias = {
            score: ['lvl', 'lvls', 'levels', 'level'],
            kills: ['kills', 'kill'],
            timeplayed: ['timeplayed', 'time'],
            funds: ['krunkies', 'money', 'funds'],
            clan: ['clan', 'clans']
        };
        
        const map = new Map();
        
        for (const [key, value] of Object.entries(lookup)) {
            value.forEach(v => Map.set(v, key));
        };

        return map;
    }
}

module.exports = Social;