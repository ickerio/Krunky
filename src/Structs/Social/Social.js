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
        return { name: board.formal, data: this.structureLeaderboard(raw) };
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
            for (const clan in data) {
                structuredData.push({
                    name: clan.clan_name,
                    score: clan.clan_score,
                    creatorname: clan.creatorname,
                    membercount: clan.clan_membercount,
                    hackcount: clan.clan_hackcount
                });
            }
        } else {
            // Data for score, funds, kills, time and wins
            for (const user in data) {
                structuredData.push({
                    name: user.player_name,
                    featured: user.player_featured ? 'Yes' : 'No',
                    clan: user.player_clan ? user.player_clan : 'No Clan',
                    attribute: this.getLevel(user.player_score) || user.player_funds || user.player_kills || user.player_timeplayed || user.player_wins,
                    hacker: user.player_hack ? user.player_hack : 'No'
                });
            }
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
            clan: data.player_clan ? data.player_clan : 'No Clan',
            featured: data.player_featured ? 'Yes' : 'No',
            hacker: data.player_hack ? data.player_hack : 'No'
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
            score: { alias: ['lvl', 'lvls', 'levels', 'level', 'score'], formal: 'Levels' },
            kills: { alias: ['kills', 'kill'], formal: 'Kills' },
            timeplayed: { alias: ['timeplayed', 'time'], formal: 'Time Played' },
            funds: { alias: ['krunkies', 'money', 'funds'], formal: 'Krunkies' },
            clan: { alias: ['clan', 'clans'], formal: 'Clans' }
        };
        
        const map = new Map();
        
        for (const [key, value] of Object.entries(table)) {
            value.alias.forEach(v => map.set(v, { api: key, formal: value.formal }));
        }

        return map;
    }
}

module.exports = Social;