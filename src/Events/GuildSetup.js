function newGuild(guild) {
    this.database.addGuild(guild.id);
}

async function checkGuilds() {
    await this.database.connect();
    this.guilds.forEach(guild => this.database.addGuild(guild.id));
}

module.exports = [
    { name: 'guildCreate', func: newGuild },
    { name: 'ready', func: checkGuilds}
];