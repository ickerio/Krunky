function newGuild(guild) {
    this.database.guild.add(guild.id);
}

function checkGuilds() {
    this.guilds.forEach(guild => this.database.guild.add(guild.id));
}

module.exports = [
    { name: 'guildCreate', func: newGuild },
    { name: 'ready', func: checkGuilds}
];