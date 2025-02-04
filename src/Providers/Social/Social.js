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
        const board = this.boardsAlias.get(alias.toLowerCase());
        if (!board) throw new Error('Leaderboard type does not exist');

        const raw = await this._getRawLeaderboard(board.api);
        return { name: board.name, unit: board.unit, data: this.structureLeaderboard(raw) };
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
        if (data[1][1] === 'player_clan') {
            // Data for clans (have different data layout)
            data[1][2].forEach(clan => {
                structuredData.push({
                    name: clan.clan_name,
                    score: clan.clan_score,
                    creatorname: clan.creatorname,
                    membercount: clan.clan_membercount,
                    hackcount: clan.clan_hackcount
                });
            });
        } else {
            // Data for score, funds, kills, time and wins
            data[1][2].forEach(user => {
                structuredData.push({
                    name: user.player_name,
                    featured: user.player_featured,
                    clan: user.player_clan,
                    attribute: this.getLevel(user.player_score) || user.player_funds || user.player_kills || user.player_timeplayed || user.player_wins,
                    hacker: user.player_hack
                });
            });
        }
        return structuredData;
    }

    structureUser(data) {
        return {
            name: data.player_name,
            id: data.player_id,
            score: data.player_score,
            level: this.getLevel(data.player_score),
            levelProgress: this.getLevelProgress(data.player_score),
            kills: data.player_kills,
            deaths: data.player_deaths,
            kdr: (data.player_kills / data.player_deaths || 0).toFixed(2),
            spk: (data.player_score / data.player_kills || 0).toFixed(2),
            totalGamesPlayed: data.player_games_played,
            wins: data.player_wins,
            loses: data.player_games_played - data.player_wins,
            wl: (data.player_wins / (data.player_games_played - data.player_wins) || 0).toFixed(2), 
            playTime: data.player_timeplayed,
            krunkies: data.player_funds,
            clan: data.player_clan,
            featured: data.player_featured,
            hacker: data.player_hack,
            following: data.player_following,
            followed: data.player_followed
        };
    }

    getLevel(score) {
        if (score === undefined) return undefined;
        return Math.max(1, Math.floor(0.03 * Math.sqrt(score)));
    }

    getLevelProgress(score) {
        const levelDecimal = 0.03 * Math.sqrt(score);
        const level = Math.floor(levelDecimal);
        return levelDecimal - level;
    }

    createAliasMap() {
        const table = {
            player_score: { alias: ['lvl', 'lvls', 'levels', 'level', 'score'], name: 'Levels', unit: 'LVL' },
            player_kills: { alias: ['kills', 'kill'], name: 'Kills', unit: 'Kills' },
            player_timeplayed: { alias: ['timeplayed', 'time'], name: 'Time Played', unit: '' },
            player_funds: { alias: ['krunkies', 'money', 'funds'], name: 'Krunkies', unit: 'KR' },
            player_clan: { alias: ['clan', 'clans'], name: 'Clans', unit: 'Score' },
            player_wins: { alias: ['wins', 'win'], name: 'Wins', unit: 'Wins' }
        };
        
        const map = new Map();
        
        for (const [key, value] of Object.entries(table)) {
            value.alias.forEach(v => map.set(v, { api: key, name: value.name, unit: value.unit }));
        }

        return map;
    }
}

module.exports = Social;