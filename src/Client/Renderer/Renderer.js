const fetch = require('node-fetch');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');

const titleFontSizePx = 20;
const lbTitleFontSizePx = 30;
const lbTitleFontSize2Px = 22;
const titleFontSize2Px = 10;
const statFontSizePx = 20;
const statFontSize2Px = 14;
const padLeft = 10;
const padRight = 10;
const padBottom = 6;
const padVertical = 15;
const padHorizontal = 10;
const progressBarInner = 3;
const titleBarHeight = 80;
const imageSize = 32;
const levelImageSize = 46;
const levelImageSize2 = 20;
const featuredImageSize = 20;
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

        // Load verified icon.
        const featuredIconData = fs.readFileSync('./res/kr-featured.png');
        this.featuredIcon = new Image();
        this.featuredIcon.src = featuredIconData;

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
        this.drawPlayerStats(data);
        this.drawFooter();

        return this.canvas.toBuffer();
    }

    async drawLeaderboardImage(board, message)
    {
        this.drawBackground();
        this.drawLeaderboardTitle(board);
        await this.drawLeaderboardList(board, message);
        this.drawFooter();

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

    drawPlayerStats(data) {
        // Draw player name.
        this.context.font = `${ data.name.length < 10  ? titleFontSizePx : titleFontSize2Px }px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(data.name, padLeft + imageSize + imagePadRight, titleBarHeight / 2 + (data.name.length < 10  ? titleFontSizePx : titleFontSize2Px) / 2);

        // Draw seperator
        this.context.fillStyle = '#a0a0a0';
        this.context.fillRect(padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal, titleBarHeight * 0.2, separatorWidth, titleBarHeight * 0.6);

        const xOffset = this.drawKrunkCoins(data);
        this.drawLevelProgress(data, xOffset);

        this.drawStatRow('Kills:'        , data.kills,               0, statFontSizePx, 0, 10);
        this.drawStatRow('Deaths:'       , data.deaths,              1, statFontSizePx, 0, 10);
        this.drawStatRow('K/D:'          , data.kdr,                 2, statFontSizePx, 0, 10);
        this.drawStatRow('Games Won:'    , data.wins,                3, statFontSizePx, 0, 10);
        this.drawStatRow('Games Played:' , data.totalGamesPlayed,    4, statFontSizePx, 0, 10);
        this.drawStatRow('W/L:'          , data.wl,                  5, statFontSizePx, 0, 10);
        this.drawStatRow('Time Played:', this.formatTimePlayed(data.playTime), 6, statFontSizePx, 0, 10);
    }

    drawFooter()
    {
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
    drawStatRow(title, stat, rowIndex, fontSize = statFontSizePx,xOffset = 0, yOffset = 0) {
        this.context.font = `${fontSize}px FFF Forward`;
        this.context.fillStyle = '#606060';
        this.context.fillText(title, padLeft + xOffset, yOffset + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
        this.context.fillStyle = '#000000';
        this.context.fillText(stat, this.canvas.width - padRight - this.context.measureText(stat).width, 10 + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
    }

    drawLeaderboardRow(name, clan, featured, stat, rowIndex, fontSize = statFontSizePx,xOffset = 0) {
        this.context.font = `${fontSize}px FFF Forward`;
        this.context.fillStyle = '#000000';
        // Draw rank number.
        this.context.fillText(rowIndex + '.', 
            padLeft, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
        // Draw username
        this.context.fillStyle = '#606060';
        this.context.fillText(name, 
            padLeft + this.context.measureText(rowIndex + '.').width + 2 * padHorizontal + xOffset, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));

        // Draw clan.
        this.context.fillStyle = '#808080';
        this.context.fillText(`[${clan}]`, 
            padLeft + this.context.measureText(rowIndex + '.').width + 3 * padHorizontal + xOffset + this.context.measureText(name).width, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));

        // Draw Verified Symbol.
        if (featured)
        {
            this.context.drawImage(this.featuredIcon, 
                padLeft + this.context.measureText(rowIndex + '.').width + 4 * padHorizontal + xOffset + this.context.measureText(name).width + this.context.measureText(`[${clan}]`).width, 
                titleBarHeight + (rowIndex + 1) * (fontSize + padVertical) - 6,
                featuredImageSize, featuredImageSize);
        }

        // Draw stat
        this.context.fillStyle = '#000000';
        this.context.fillText(stat, 
            this.canvas.width - padRight - this.context.measureText(stat).width, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
    }

    drawLevelLeaderboardRow(name, clan, featured, level, rowIndex, fontSize = statFontSizePx,xOffset = 0) {
        this.context.font = `${fontSize}px FFF Forward`;
        this.context.fillStyle = '#000000';
        // Draw rank number.
        this.context.fillText(rowIndex + '.', 
            padLeft, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
        // Draw username
        this.context.fillStyle = '#606060';
        this.context.fillText(name, 
            padLeft + this.context.measureText(rowIndex + '.').width + 2 * padHorizontal + xOffset, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));

        // Draw clan.
        this.context.fillStyle = '#808080';
        this.context.fillText(`[${clan}]`, 
            padLeft + this.context.measureText(rowIndex + '.').width + 3 * padHorizontal + xOffset + this.context.measureText(name).width, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));

        // Draw Verified Symbol.
        if (featured)
        {
            this.context.drawImage(this.featuredIcon, 
                padLeft + this.context.measureText(rowIndex + '.').width + 4 * padHorizontal + xOffset + this.context.measureText(name).width + this.context.measureText(`[${clan}]`).width, 
                titleBarHeight + (rowIndex + 1) * (fontSize + padVertical) - 6,
                featuredImageSize, featuredImageSize);
        }

        // Draw level icon.
        this.context.drawImage(this.levelIcons[Math.min(Math.ceil(( parseInt(level) - 1) / 3 - 1), this.levelIcons.length - 1)], 
            this.canvas.width - padRight - this.context.measureText(level).width - levelImageSize2 - padHorizontal, 
            titleBarHeight + (rowIndex + 1) * (fontSize + padVertical), 
            levelImageSize2, levelImageSize2);

        // Draw level
        this.context.fillStyle = '#000000';
        this.context.fillText(level, 
            this.canvas.width - padRight - this.context.measureText(level).width, 
            fontSize + titleBarHeight + (rowIndex + 1) * (fontSize + padVertical));
    }

    drawKrunkCoins(data) {
        // Draw krunk coin icon.
        this.context.drawImage(this.krIcon, padLeft + imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 2 + separatorWidth, 
            titleBarHeight / 2 - imageSize / 2 - 4, 
            imageSize, imageSize);

        // Calculate the xOffset before the font is changed.
        const xOffset = padLeft + 2 * imageSize + imagePadRight + this.context.measureText(data.name).width + padHorizontal * 3 + separatorWidth;
        this.context.font = `${ titleFontSizePx }px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(this.formatKrunkCoins(data.krunkies), xOffset, titleBarHeight / 2 + titleFontSizePx / 2);

        return xOffset + this.context.measureText(data.krunkies).width;
    }

    formatKrunkCoins(krunkies)
    {
        // Get abbreviation for coin amount.
        let text = '';
        if (krunkies >= 1e6) {
            text = Math.floor(krunkies / 1e5) / 10 + 'M';
        }
        else if (krunkies >= 1e3) {
            text = Math.floor(krunkies / 1e2) / 10 + 'k';
        }
        else {
            text = krunkies;
        }
        return text;
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
            (this.canvas.width - xOffset -  2 * padHorizontal - separatorWidth - padRight - 2 * progressBarInner) * data.levelProgress, 
            titleBarHeight / 4 - 2 * progressBarInner);
        
        this.context.drawImage(this.levelIcons[Math.ceil(( data.level - 1) / 3 - 1)], 
            xOffset + padHorizontal + separatorWidth, titleBarHeight / 4 - imageSize / 2, levelImageSize, levelImageSize);
        
        this.context.font = `${Math.floor(titleFontSizePx * 0.8)}px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(`LVL ${data.level}`, 
            xOffset + padHorizontal + separatorWidth + levelImageSize, titleBarHeight / 2);
    }

    formatTimePlayed(time) {
        if (time === undefined) return undefined;
        let str = '';
        const minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
        const hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
        const days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
        if (days) str += `${days}d `;
        if (hours) str += `${hours}h `;
        if (minutes) str += `${minutes}m`;
        return str;
    }

    drawLeaderboardTitle(board)
    {
        this.context.font = `${board.length < 8  ? lbTitleFontSizePx : lbTitleFontSize2Px}px FFF Forward`;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(board.name.charAt(0).toUpperCase() + board.name.slice(1) + ' Leaderboard', 2 * padLeft, titleBarHeight / 2 + (board.length < 15  ? lbTitleFontSizePx : lbTitleFontSize2Px) * 0.6);
    }

    async drawLeaderboardList(board, message)
    {
        this.drawStatRow('', board.unit, 0, statFontSize2Px);
        
        for(let i = 0; i < 8; i++)
        {
            if(board.name == 'Levels')
            {
                this.drawLevelLeaderboardRow(board.data[i].name, board.data[i].clan, board.data[i].featured, board.data[i].attribute, i + 1, statFontSize2Px);
            }
            else if(board.name == 'Krunkies')
            {
                this.drawLeaderboardRow(board.data[i].name, board.data[i].clan, board.data[i].featured, this.formatKrunkCoins(board.data[i].attribute), i + 1, statFontSize2Px);
            }
            else if(board.name == 'Time Played')
            {
                this.drawLeaderboardRow(board.data[i].name, board.data[i].clan, board.data[i].featured, this.formatTimePlayed(board.data[i].attribute), i + 1, statFontSize2Px);
            }
            else
            {
                this.drawLeaderboardRow(board.data[i].name, board.data[i].clan, board.data[i].featured, board.data[i].attribute, i + 1, statFontSize2Px);
            }
            
        }
    }
} 

module.exports = Canvas;