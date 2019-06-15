const Discord = require('discord.js');
const Command = require('../Structs/Command.js');
const Social = require('../Structs/Social/Social.js');
const { createCanvas } = require('canvas');

// Init Canvas.
const canvas = createCanvas(400, 400);
const context = canvas.getContext('2d');

const titleFontSizePx = 25;
const statFontSizePx = 20;
const padLeft = 10;
const padRight = 10;
const padTop = 44;
const padBottom = 6;
const padVertical = 15;
const progressBarWidth = 150;
const progressPadLeft = 30;

const date = new Date();
const social = new Social();

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
        try {
            const data = await social.getUser(args.name);

            // TODO: Create image and send.
            this._createBackground();
            this._renderPlayerInfo(data);
            var attachment = new Discord.Attachment(canvas.toBuffer(), args.name + '-Krunky.png');

            message.channel.send(attachment);
        } catch (error) {
            message.reply(error);
        }
    }

    _createBackground() {
        // Clear canvas for new image.
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#e6e6e6';
        context.fillRect(0, 0, canvas.width, canvas.height, canvas.width, canvas.height);
    }

    _renderPlayerInfo(data) {
        context.font = `${titleFontSizePx}px FFF Forward`;
        context.fillStyle = '#000000';
        context.fillText(data.name, padLeft, padTop);

        this._renderStatRow('Level:', '', 0);
        // Create percentage bar.
        context.fillStyle = '#202020';
        context.fillRect(padLeft + context.measureText('Level:').width + progressPadLeft, 10 + padTop + 0.2 * statFontSizePx + padVertical, progressBarWidth, statFontSizePx * 0.8);
        context.fillStyle = '#F2F202';
        context.fillRect(padLeft + context.measureText('Level:').width + progressPadLeft + progressBarWidth * 0.025, 10 + padTop + 0.36 * statFontSizePx + padVertical, progressBarWidth * 0.95 * this._findScore(data.score), statFontSizePx * 0.8 * 0.7);

        this._renderStatRow('Kills:'        , data.kills,               1);
        this._renderStatRow('Deaths:'       , data.deaths,              2);
        this._renderStatRow('K/D:'          , data.kdr,                 3);
        this._renderStatRow('Games Played:' , data.totalGamesPlayed,    4);
        this._renderStatRow('Games Won:'    , data.wins,                5);
        this._renderStatRow('W/L:'          , data.wl,                  6);
        this._renderStatRow('Time Played:'  , data.playTime,            7);

        context.font = '15px FFF Forward';
        context.fillStyle = '#b0b0b0';

        context.fillText('Krunky', padLeft, canvas.height - padBottom);
        var dateString = date.toDateString();
        context.fillText(`${dateString}`, canvas.width - padRight - context.measureText(dateString).width, canvas.height - padBottom);
    }

    /**
     * @param {string} title - The title of the statistic
     * @param {string} stat - The statistic's value
     * @param {int} rowIndex - The row number of the statistic, indicating how far down it will be displayed in the canvas
     */
    _renderStatRow(title, stat, rowIndex) {
        context.font = `${statFontSizePx}px FFF Forward`;
        context.fillStyle = '#606060';
        context.fillText(title, padLeft, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
        context.fillStyle = '#000000';
        context.fillText(stat, canvas.width - padRight - context.measureText(stat).width, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
    }

    _findScore(score) {
        var levelDecimal = 0.03 * Math.sqrt(score);
        var level = Math.floor(levelDecimal);
        return Math.round(levelDecimal - level);
    }
}

module.exports = PlayerCommand;