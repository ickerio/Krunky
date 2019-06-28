function newGuild(guild) {
    this.database.guildAdd(guild.id);
}

function checkGuilds() {
    this.guilds.forEach(guild => this.database.guildAdd(guild.id));
}

module.exports = [
    { name: 'guildCreate', func: newGuild },
    { name: 'ready', func: checkGuilds}
];