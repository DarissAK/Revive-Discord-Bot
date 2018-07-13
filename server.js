/* jshint esversion: 6 */
const myConfig = require('./config.json');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const request = require('request');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const bot = new Discord.Client({
    autoReconnect: true
});
app.set('serverPort', myConfig.serverPort);
app.use(bodyParser.urlencoded({
    extended: true
}));
let possibleAppTags = [];
let botInvites = [];
app.use(bodyParser.json());

bot.on('message', message => {

});

bot.on('ready', () => {
    console.log('I am ready!');
    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    //console.log(guild.roles);
});

bot.on('guildMemberAdd', (member) => {
    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    if (guild.available) {
        guild.fetchMembers()
            .then(() => {
                console.log(possibleAppTags);
                for (var i = 0; i < possibleAppTags.length; i++) {
                    if (member.user.username === possibleAppTags[i][0] && member.user.discriminator === possibleAppTags[i][1]) {
                        console.log(member.user.id + ' username of ' + member.user.username + "#" + member.user.discriminator + ' matched user we are looking for ' + possibleAppTags[i][0] + "#" + possibleAppTags[i][1]);
                        //member.send(`@${member.user.username}#${member.user.discriminator} We've been looking for you, welcome to the Baddies US-Stormreaver discord server. You'll be automatically moved to your application discussion shortly.`);
                        createApplicantUserChannel(member, i);
                    }
                }
            }).catch(console.error);
    }
});

const createApplicantUserChannel = (member, i) => {

    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    let _this = this;
    if (guild.available) {
        const channelName = possibleAppTags[i][2]
        const formattedTag = possibleAppTags[i][2]
        const permissions = [{
                id: '467141832128725007',
                type: 'role',
                deny: 3072,
                allow: 0
            },
            {
                id: '467211944185823233',
                type: 'role',
                deny: 0,
                allow: 3072
            }
        ];
        //guild.createChannel(channelName, 'text');
        let appCategory = "applications";
        let appChannel = bot.channels.find("name", appCategory);
        guild.createChannel(channelName, 'text', permissions)
            .then(channel => {
                channel.setParent(appChannel);
                //channel.send(`@everyone New application please review.`);
                //channel.send('Application data here, or URL to app');
                member.addRole(myConfig.applicantRoleID)
                    .then((member) => {
                        channel.overwritePermissions(member, {
                                SEND_MESSAGES: true,
                                READ_MESSAGES: true,
                                EMBED_LINKS: true,
                                READ_MESSAGE_HISTORY: true,
                                ATTACH_FILES: true
                            })
                            .then(() => {
                                member.setNickname(possibleAppTags[i][2])
                                    .then((applicant) => {
                                        channel.send(`Hello ${applicant.user}, we've been looking for you. Welcome to the Baddies US-Stormreaver discord server.`);
                                        channel.send(`${applicant.user} Thanks for applying to Baddies. You can find your application here <link>. This thread will be used for app discussion. Please feel free to ask any questions.`);
                                    })
                                    .catch(console.error);
                            }).catch(console.error);
                    }).catch(console.error);
            }).catch(console.error());
    }
};

app.get('/discord/receiveUserInfoFromApp/:discordName/:discordNumber/:charName', (request, response) => {
    const {
        method,
        url
    } = request;
    const {
        headers
    } = request;
    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    if (guild.available) {
        possibleAppTags.push([request.params.discordName, request.params.discordNumber, request.params.charName]);
        console.log(possibleAppTags);
        response.send("success");
    }
});

app.get('/discord/checkUserOnServer', (request, response) => {
    const {
        method,
        url
    } = request;
    const {
        headers
    } = request;
    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    if (guild.available) {}
});

app.get('/discord/receiveInsightURLToPostToChannel', (request, response) => {
    const {
        method,
        url
    } = request;
    const {
        headers
    } = request;
    let guild = bot.guilds.find(val => val.id === myConfig.guildID);
    if (guild.available) {}
});

app.get('/discord', (req, res) => {
    res.send("Revive-Discord-Bot");
});

app.get('/discord/callback', (req, res) => {
    //Handle Discord Request URI?
});

bot.login(myConfig.discordKey);

server.listen(app.get('serverPort'));
console.log('Listening on port', app.get('serverPort'));
