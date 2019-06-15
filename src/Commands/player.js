const Discord = require('discord.js');
const fetch = require('node-fetch');
const Cache = require('../Structs/Cache/Cache.js');
const { createCanvas, Image } = require('canvas');

const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');

// Init Canvas.
const canvas = createCanvas(400, 400);
const context = canvas.getContext('2d');

const titleFontSizePx = 20;
const titleFontSize2Px = 10;
const statFontSizePx = 20;
const padLeft = 10;
const padRight = 10;
const padTop = 44;
const padBottom = 6;
const padVertical = 15;
const padHorizontal = 10;
const progressBarWidth = 150;
const progressPadLeft = 30;
const titleBarHeight = 60;
const imageSize = 32;
const imagePadRight = 10;
const imageBorderThickness = 3;
const separatorWidth = 4;

const social = new Social();
const cache = new Cache(60 * 1000);

// Load krunker images.

class PlayerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'Player',
            useName: 'player',
            description: 'Gets stats on a given player',
            args: { name: {required: true }},
    
            type: 'Krunker',
            usage: 'player <player name>',
            alliases: [],
            ownerOnly: false,
            channelTypes: ['dm', 'group', 'text']
        });
    }

    async run(message, args) {
        if (cache.has(args.name)) return message.channel.send(cache.get(args.name));

        try {
            const data = await social.getUser(args.name);

            this.drawBackground();
            await this.drawAvatar(message);
            this.drawPlayerInfo(data);

            const attachment = await new Discord.Attachment(canvas.toBuffer(), args.name + '-Krunky.png');
            cache.set(args.name, attachment);

            message.channel.send(attachment);
        } catch (error) {
            message.reply(error);
        }
    }

    drawBackground() {
        // Clear canvas for new image.
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#e6e6e6';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#1a1f26';
        context.fillRect(0, 0, canvas.width, titleBarHeight);
    }

    async drawAvatar(message) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(padLeft - imageBorderThickness, titleBarHeight / 2 - imageSize / 2 - imageBorderThickness, imageSize + imageBorderThickness * 2, imageSize + imageBorderThickness * 2);

        const data = await fetch(message.author.avatarURL.replace(/(size=)[^&]+/, '$1' + imageSize));
        const buffer = await data.buffer();
        const img = new Image();
        img.src = buffer;
        return await context.drawImage(img, padLeft, titleBarHeight / 2 - imageSize / 2);
    }

    drawPlayerInfo(data) {
        // Draw player name.
        context.font = `${ data.name.length < 10  ? titleFontSizePx : titleFontSize2Px }px FFF Forward`;
        context.fillStyle = '#FFFFFF';
        context.fillText(data.name, padLeft + imageSize + imagePadRight, padTop);

        // Draw player krunk coins.
        context.fillStyle = '#a0a0a0';
        context.fillRect(padLeft + imageSize + imagePadRight + context.measureText(data.name).width + padHorizontal, titleBarHeight * 0.2, separatorWidth, titleBarHeight * 0.6);

        

        // Draw player level.

        this.drawStatRow('Level:', `${data.level}`, 0);
        // Create percentage bar.
        context.fillStyle = '#202020';
        context.fillRect(padLeft + context.measureText('Level:').width + progressPadLeft, 10 + padTop + 0.2 * statFontSizePx + padVertical, progressBarWidth, statFontSizePx * 0.8);
        context.fillStyle = '#F2F202';
        context.fillRect(padLeft + context.measureText('Level:').width + progressPadLeft + progressBarWidth * 0.025, 
            10 + padTop + 0.36 * statFontSizePx + padVertical, 
            progressBarWidth * 0.95 * this.getLevelProgress(data.score), 
            statFontSizePx * 0.8 * 0.7);

        this.drawStatRow('Kills:'        , data.kills,               1);
        this.drawStatRow('Deaths:'       , data.deaths,              2);
        this.drawStatRow('K/D:'          , data.kdr,                 3);
        this.drawStatRow('Games Played:' , data.totalGamesPlayed,    4);
        this.drawStatRow('Games Won:'    , data.wins,                5);
        this.drawStatRow('W/L:'          , data.wl,                  6);
        this.drawStatRow('Time Played:'  , data.playTime,            7);

        context.font = '15px FFF Forward';
        context.fillStyle = '#b0b0b0';

        context.fillText('Krunky', padLeft, canvas.height - padBottom);
        const dateString = new Date().toDateString();
        context.fillText(`${dateString}`, canvas.width - padRight - context.measureText(dateString).width, canvas.height - padBottom);
    }

    /**
     * @param {string} title - The title of the statistic
     * @param {string} stat - The statistic's value
     * @param {int} rowIndex - The row number of the statistic, indicating how far down it will be displayed in the canvas
     */
    drawStatRow(title, stat, rowIndex) {
        context.font = `${statFontSizePx}px FFF Forward`;
        context.fillStyle = '#606060';
        context.fillText(title, padLeft, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
        context.fillStyle = '#000000';
        context.fillText(stat, canvas.width - padRight - context.measureText(stat).width, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
    }

    getLevelProgress(score) {
        const levelDecimal = 0.03 * Math.sqrt(score);
        const level = Math.floor(levelDecimal);
        return levelDecimal - level;
    }
}

module.exports = PlayerCommand;