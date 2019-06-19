function newGuild(guild) {
    this.database.guildAdd(guild.id);
}

async function checkGuilds() {
    await this.database.connect();
    this.guilds.forEach(guild => this.database.guildAdd(guild.id));
}

module.exports = [
    { name: 'guildCreate', func: newGuild },
    { name: 'ready', func: checkGuilds}
];