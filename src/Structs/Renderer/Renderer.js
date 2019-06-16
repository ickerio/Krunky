const fetch = require('node-fetch');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');

const titleFontSizePx = 20;
const titleFontSize2Px = 10;
const statFontSizePx = 20;
const padLeft = 10;
const padRight = 10;
const padBottom = 6;
const padVertical = 15;
const padHorizontal = 10;
const progressBarInner = 3;
const titleBarHeight = 80;
const imageSize = 32;
const levelImageSize = 46;
const imagePadRight = 10;
const imageBorderThickness = 3;
const separatorWidth = 4;

class Canvas {
    constructor(){
        // Initialise canvas.
        this.canvas = createCanvas(400, 400);
        this.context = this.canvas.getContext('2d');

        // Load krunker coin icon.
        const krIconData = fs.readFileSync('./res/kr-icon.png');
        this.krIcon = new Image();
        this.krIcon.src = krIconData;

        // Load all player level icons.
        this.levelIcons = [];
        for(let i = 0; i < 100; i++)
        {
            if(i % 3 == 0)
            {
                const levelIconData = fs.readFileSync(`./res/levels/${i + 1}.png`);
                const levelIcon = new Image();
                levelIcon.src = levelIconData;
                this.levelIcons.push(levelIcon);
            }
        }
    }

    async drawPlayerImage(data, message) {
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
        this.context.fillText(data.name, padLeft + imageSize + imagePadRight, titleBarHeight / 2 + (data.name.length < 10  ? titleFontSizePx : titleFontSize2Px) / 2);

        // Draw seperator
        this.context.fillStyle = '#a0a0a0';
        this.context.fillRect(padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal, titleBarHeight * 0.2, separatorWidth, titleBarHeight * 0.6);

        const xOffset = this.drawKrunkCoins(data);
        this.drawLevelProgress(data, xOffset);

        this.drawStatRow('Kills:'        , data.kills,               0);
        this.drawStatRow('Deaths:'       , data.deaths,              1);
        this.drawStatRow('K/D:'          , data.kdr,                 2);
        this.drawStatRow('Games Won:'    , data.wins,                3);
        this.drawStatRow('Games Played:' , data.totalGamesPlayed,    4);
        this.drawStatRow('W/L:'          , data.wl,                  5);
        this.drawStatRow('Time Played:'  , data.playTime,            6);

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
        this.context.fillText(title, padLeft, 10 + titleBarHeight + (rowIndex + 1) * (statFontSizePx + padVertical));
        this.context.fillStyle = '#000000';
        this.context.fillText(stat, this.canvas.width - padRight - this.context.measureText(stat).width, 10 + titleBarHeight + (rowIndex + 1) * (statFontSizePx + padVertical));
    }

    drawKrunkCoins(data) {
        // Draw krunk coin icon.
        this.context.drawImage(this.krIcon, padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 2 + separatorWidth, 
            titleBarHeight / 2 - imageSize / 2 - 4, 
            imageSize, imageSize);

        // Get abbreviation for coin amount.
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

        // Calculate the xOffset before the font is changed.
        const xOffset = padLeft + 2 * imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 3 + separatorWidth;
        this.context.font = `${ titleFontSizePx }px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(text, xOffset, titleBarHeight / 2 + titleFontSizePx / 2);

        return xOffset + this.context.measureText(data.krunkies).width;
    }

    drawLevelProgress(data, xOffset) {

        // Draw seperator
        this.context.fillStyle = '#a0a0a0';
        this.context.fillRect(xOffset + padHorizontal, titleBarHeight * 0.2, separatorWidth, titleBarHeight * 0.6);

        // Create percentage bar.
        this.context.fillStyle = '#000000';
        this.context.fillRect(xOffset +  2 * padHorizontal + separatorWidth, titleBarHeight * 0.6, this.canvas.width - xOffset -  2 * padLeft - separatorWidth - padRight, titleBarHeight / 4);
        this.context.fillStyle = '#F2F202';
        this.context.fillRect(xOffset +  2 * padHorizontal + separatorWidth + progressBarInner, 
            titleBarHeight * 0.6 + progressBarInner, 
            (this.canvas.width - xOffset -  2 * padHorizontal - separatorWidth - padRight - 2 * progressBarInner) * this.getLevelProgress(data.score), 
            titleBarHeight / 4 - 2 * progressBarInner);

        this.context.drawImage(this.levelIcons[( Math.floor( 0.03 * Math.sqrt(data.score) ) - 1) / 3 - 1], 
            xOffset + 2 * padHorizontal + separatorWidth, titleBarHeight / 4 - imageSize / 2, levelImageSize, levelImageSize);
    }

    getLevelProgress(score) {
        const levelDecimal = 0.03 * Math.sqrt(score);
        const level = Math.floor(levelDecimal);
        return levelDecimal - level;
    }
} 

module.exports = Canvas;