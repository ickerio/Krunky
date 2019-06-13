const Discord = require('discord.js');
const fetch = require('node-fetch');
const Social = require('./Social/Social.js');

const client = new Discord.Client();

async function getGames() {
    return fetch('https://matchmaker.krunker.io/game-list?hostname=krunker.io')
        .then(res => res.json())
}

const social = new Social();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith('!player ')) {
            social.getUser(msg.content.split(' ')[1])
                .then(d => msg.channel.send(JSON.stringify(d)))
                .catch(err => console.log(err));
    }
});

client.login(require('../config.json').token);