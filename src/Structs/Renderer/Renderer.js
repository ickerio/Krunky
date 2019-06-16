const fetch = require('node-fetch');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');

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
const titleBarHeight = 60;
const imageSize = 32;
const imagePadRight = 10;
const imageBorderThickness = 3;
const separatorWidth = 4;

class Canvas {
    constructor(){
        this.canvas = createCanvas(400, 400);
        this.context = this.canvas.getContext('2d');
    }

    async drawPlayer(data, message) {
        this.drawBackground();
        await this.drawAvatar(message);
        this.drawPlayerInfo(data);

        return this.canvas.toBuffer();
    }

    drawBackground() {
        // Clear canvas for new image.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#e6e6e6';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#1a1f26';
        this.context.fillRect(0, 0, this.canvas.width, titleBarHeight);
    }

    async drawAvatar(message) {
        this.context.fillStyle = '#a0a0a0';
        this.context.fillRect(padLeft - imageBorderThickness, titleBarHeight / 2 - imageSize / 2 - imageBorderThickness, imageSize + imageBorderThickness * 2, imageSize + imageBorderThickness * 2);

        const data = await fetch(message.author.avatarURL.replace(/(size=)[^&]+/, '$1' + imageSize));
        const img = new Image();
        img.src = await data.buffer();
        await this.context.drawImage(img, padLeft, titleBarHeight / 2 - imageSize / 2);
    }

    drawPlayerInfo(data) {
        // Draw player name.
        this.context.font = `${ data.name.length < 10  ? titleFontSizePx : titleFontSize2Px }px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(data.name, padLeft + imageSize + imagePadRight, padTop);

        // Draw seperator
        this.context.fillStyle = '#a0a0a0';
        this.context.fillRect(padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal, titleBarHeight * 0.2, separatorWidth, titleBarHeight * 0.6);

        this.drawKrunkCoins(data);

        // Draw player level.
        this.drawStatRow('Level:', `${data.level}`, 0);
        
        // Create percentage bar.
        this.context.fillStyle = '#202020';
        this.context.fillRect(padLeft + this.context.measureText('Level:').width + padHorizontal, 10 + padTop + 0.2 * statFontSizePx + padVertical, progressBarWidth, statFontSizePx * 0.8);
        this.context.fillStyle = '#F2F202';
        this.context.fillRect(padLeft + this.context.measureText('Level:').width + padHorizontal + progressBarWidth * 0.025, 
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

        this.context.font = '15px FFF Forward';
        this.context.fillStyle = '#b0b0b0';

        this.context.fillText('Krunky', padLeft, this.canvas.height - padBottom);
        const dateString = new Date().toDateString();
        this.context.fillText(`${dateString}`, this.canvas.width - padRight - this.context.measureText(dateString).width, this.canvas.height - padBottom);
    }

    /**
     * @param {string} title - The title of the statistic
     * @param {string} stat - The statistic's value
     * @param {int} rowIndex - The row number of the statistic, indicating how far down it will be displayed in the canvas
     */
    drawStatRow(title, stat, rowIndex) {
        this.context.font = `${statFontSizePx}px FFF Forward`;
        this.context.fillStyle = '#606060';
        this.context.fillText(title, padLeft, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
        this.context.fillStyle = '#000000';
        this.context.fillText(stat, this.canvas.width - padRight - this.context.measureText(stat).width, 10 + padTop + (rowIndex + 1) * (statFontSizePx + padVertical));
    }

    drawKrunkCoins(data) {
        const imageData = fs.readFileSync('./res/kr-icon.png');
        const img = new Image();
        img.src = imageData;
        this.context.drawImage(img, padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 2 + separatorWidth, 
            titleBarHeight / 2 - imageSize / 2, imageSize, imageSize);

        let text = '';
        if (data.krunkies >= 1e6) {
            text = Math.floor(data.krunkies / 1e5) / 10 + 'M';
        }
        else if (data.krunkies >= 1e3) {
            text = Math.floor(data.krunkies / 1e2) / 10 + 'k';
        }
        else {
            text = data.krunkies;
        }

        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(text, padLeft + 2 * imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 3 + separatorWidth, padTop);
    }

    getLevelProgress(score) {
        const levelDecimal = 0.03 * Math.sqrt(score);
        const level = Math.floor(levelDecimal);
        return levelDecimal - level;
    }
} 

module.exports = Canvas;