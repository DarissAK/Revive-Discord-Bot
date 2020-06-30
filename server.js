/* jshint esversion: 6 */
const appRoot = require("app-root-path");
const myConfig = require("./config.json");
const express = require("express");
const {
  createLogger,
  format,
  transports
} = require("winston");
const {
  combine,
  timestamp,
  label,
  prettyPrint
} = format;
const fs = require("fs");
const app = express();
const http = require("http");
const jwt = require("jsonwebtoken");
const server = http.createServer(app);
const request = require("request");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const bot = new Discord.Client({
  autoReconnect: true
});

app.set("serverPort", myConfig.serverPort);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.set("trust proxy", true);

let possibleAppTags = [];
let botInvites = [];

const secretKey = myConfig.secretKey;
const chatLog = myConfig.chat_log;

if (!global.guild) {
  global.guild;
}

const logDir = appRoot + "/log";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const myFormat = format.printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});
const tsFormat = () => new Date().toLocaleTimeString();
const logger = createLogger({
  format: combine(
    label({
      label: "Baddies-Bot"
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      colorize: true,
      timestamp: tsFormat,
      level: "error"
    }),
    new transports.File({
      filename: `${logDir}/combined.log`,
      timestamp: tsFormat,
      level: "debug"
    })
  ]
});

bot.on("ready", () => {
  console.log("I am ready!");
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  //console.log(guild.roles);
  global.guild = bot.guilds.get(myConfig.guildID);
  //let testMemberSearch = guild.members.find("displayName", 'Dariss');
  //console.log(testMemberSearch);
});

bot.on("message", message => {
  if (message.author.bot === false) {
    if (chatLog) {
      if (message.channel.name === "announcements") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      if (message.channel.name === "healers") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      /* -- Disabled for officer --
            if (message.channel.name === 'officer') {
                logger.info('#' + message.channel.name + " <" + message.author.username + ">: " + message.content);
            }

            if (message.channel.name === 'officer-notes') {
                logger.info('#' + message.channel.name + " <" + message.author.username + ">: " + message.content);
            }
      */

      if (message.channel.name === "late-missing") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      if (message.channel.name === "strategy") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      if (message.channel.name === "raider-only") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      if (message.channel.parent.name === "applications") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }

      if (message.channel.parent.name === "wcl") {
        logger.info(
          "#" +
          message.channel.name +
          " <" +
          message.author.username +
          ">: " +
          message.content
        );
      }
    }

    // --- Memes ---
    if (message.content === "!daemios app") {
      message.channel.send("https://baddies.org/keep_forever/Swagga%20App.png").catch(() => {});
    }

    if (message.content === "!daemios roll") {
      message.channel.send("https://www.youtube.com/watch?v=Op2aUjmGTOM").catch(() => {});
    }

    if (message.content === "!poverty") {
      message.channel.send("https://www.youtube.com/watch?v=0U4ieafzfg8").catch(() => {});
    }

    if (message.content === "!gatekeeper") {
      message.channel.send("https://www.youtube.com/watch?v=WQLKS8Z31Es").catch(() => {});
    }

    if (message.content === "!notscalysswamp") {
      message.channel.send("https://i.imgur.com/sQjutsC.gifv").catch(() => {});
    }

    if (message.content === "!myrien tryhard") {
      message.channel.send(
        "https://clips.twitch.tv/HilariousHelplessBobaKeepo"
      ).catch(() => {});
    }

    // --- App Commands ---
    if (message.channel.parent.name === "applications") {
      const logChannel = guild.channels.find('name', 'bot-testing');

      if (message.content === "!debug message") {
        message.channel.send(message).catch(message.channel.send(error()));
      }
      if (message.content === "!debug linetest") {
        logChannel.send(
          "\`\`\`" +
          "test1 \n" +
          "test2" +
          "\`\`\`"
        ).catch(() => {});
      }
      if (message.content === "!debug channeltest") {
        logChannel.send(`\`\`\`Attempting to create channel DEBUG through the bot using createApplicantUserChannel()\`\`\``).catch(() => {});
      }
      if (message.content === "!debug length") {
        logChannel.send(`\`\`\`possibleAppTags length: ${possibleAppTags.length}\`\`\``).catch(() => {});
      }
      if (message.content === "!debug pendingapps") {

        logChannel.send(`\`\`\`Listing pending apps - \`\`\``).catch(() => {});
        if (possibleAppTags.length == 0) {
          logChannel.send(`\`\`\`No pending apps found\`\`\``).catch(() => {});
        }
        // Iterate through possible apps
        for (var i = 0; i < possibleAppTags.length; i++) {
          let sendTextDebug = JSON.stringify(possibleAppTags[i]);
          logChannel.send(`\`\`\`${sendTextDebug}\`\`\``).catch(() => {});
        }
      }
      if (message.content === "!debug status") {
        message.channel
          .send("I'm running")
          .catch(() => {});
      }

      let foundname = false;

      try {
        message.guild.fetchMember(message.author).then(member => {
          //console.log(officerRank);
          if (checkOfficer(member, message)) {
            // Piece of crap code to get the member object from the channel name. Assumes channel name = display name.
            // DON'T EVER CHANGE THE APPLICANT NICKNAME OTHERWISE THIS WON'T WORK.
            let channelMembers = message.channel.members;
            for (var i in channelMembers.array()) {
              member = channelMembers.array()[i];
              if (
                member.displayName.toLowerCase() ===
                message.channel.name.toLowerCase()
              ) {
                foundname = true;
                try {
                  //message.channel.send(`Got the ID for ${member.displayName}, ${member.id}`);
                } catch (e) {
                  console.log(e)
                }
                applicantMemberID = member.id;
                break;
              } else {
                //message.channel.send(`Names don't match ${member.displayName}, ${member.id}. Tried matching ${member.displayName.toLowerCase()} to ${message.channel.name.toLowerCase()}`);
              }
            }

            if (message.channel.name === "bot-testing") {
              message.channel.send(
                `Wrong channel.`
              ).catch(() => {});
              throw "Tried to send app command to bot-testing - no."
            }

            if (message.content === "!app archive") {
              // channel category we are going to make a channel under
              let archiveCategory = "archive";
              // get the channel object for the name above
              let archiveChannel = guild.channels.find("name", archiveCategory);
              logChannel.send(`\`\`\`Moving ${message.channel.name} to archive.\`\`\``).catch(() => {});
              message.channel.send(
                `Moving channel to archive.`
              ).catch(() => {});
              message.channel.setParent(archiveChannel);
            }

            // run this if block if no match found
            if (!foundname) {
              if (message.content === "!app help") {
                // this is here in case someone forgets how to use the !app commands
                message.channel.send(
                  `WARNING: User does not exist or applicants nickname does not match channel name of ${message.channel.name.toLowerCase()}.`
                ).catch(() => {});
                message.channel.send(
                  '"!app accept" accepts the app, moves the channel to feedback, and then promotes them to member in Discord.\n"!app decline" declines the app, moves the channel to archive, sends them a DM, and then removes the applicant role in Discord.'
                ).catch(() => {});
              }
              if (message.content === "!app accept") {
                message.channel.send(
                  `Cannot find member with nickname ${message.channel.name.toLowerCase()}.`
                ).catch(() => {});
              }
              if (message.content === "!app decline") {
                // Lets decline the app and do a bunch of stuff
                message.channel.send(
                  `Cannot find member with nickname ${message.channel.name.toLowerCase()}.`
                ).catch(() => {});
              }
            } else if (foundname) {
              let applicantMember = guild.members.get(applicantMemberID);

              if (message.content === "!app help") {
                // this is here in case someone forgets how to use the !app commands
                message.channel.send(
                  '"!app accept" accepts the app, moves the channel to feedback, sends them a DM, and then promotes them to the Trial rank in Discord.\n"' +
                  '!app decline" declines the app, deletes the channel, sends them a DM, and then removes the applicant role in Discord.'
                ).catch(() => {});
              }

              if (message.content === "!app accept") {

                let welcomeChannel = guild.channels.find(
                  "name",
                  "welcome-to-baddies"
                );

                // send DM with app status
                applicantMember.send(
                  "Hey! You've been accepted! Take a look at your application channel for instructions. Welcome to Baddies!"
                ).catch(() => {});

                // Lets accept the app, and do a bunch of stuff
                /*
                  - Send channel message about the app being accepted
                  - Move the channel to feedback category
                  - Change name on channel to strip server name
                  - Remove permissions for members and robot testers
                  - Remove applicant role from user
                  - Add trial role to user
                */
                message.channel.send(
                  `Hey ${applicantMember.user}! Congratulations, you've been accepted into Baddies! You can whisper anyone at raider rank or up for an invite, or with any questions about the process. \n\nIf you are leaving a guild, we think it's courteous to give them a heads up if you haven't already, and we're flexible about you transferring later if your guild needs some time. It wont affect your acceptance if you need a week or two. \n\nFinally, please take a look at our ${welcomeChannel} channel to review what we expect from you. The things in that channel are critical to your success during your trial period.`
                ).catch(() => {});

                // lets archive the channel under the feedback header instead of deleting it
                // channel category we are going to make a channel under
                let feedbackCategory = "Feedback";
                // get the channel object for the name above
                let feedbackChannel = guild.channels.find("name", feedbackCategory);
                // logging to bot-testing
                logChannel.send(
                  `\`\`\`` +
                  `Moving ${message.channel.name} to feedback becuase the app was accepted. \n` +
                  `Removing applicant role on ${applicantMember.nickname}. \n` +
                  `Adding member role on ${applicantMember.nickname}. ` +
                  `\`\`\``
                ).catch(() => {});
                // send message to the channel
                message.channel.send(
                  `Moving channel to feedback and removing permissions for regular members.`
                ).catch(() => {});
                // move channel to new parent
                message.channel.setParent(feedbackChannel, "App Accepted - " + message.channel.name)
                  .then(() => {
                    // change channel name to just be character name
                    let serverPattern = /-.*/g;
                    let newChannelName = message.channel.name.replace(serverPattern, "");
                    message.channel.setName(newChannelName, "App Accepted - " + message.channel.name)
                      .then(() => {
                        // remove members permissions
                        message.channel
                          .overwritePermissions(myConfig.memberRoleID, {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false
                          }).catch(() => {});
                        // remove Robot Tester permissions

                        message.channel
                          .overwritePermissions('467121525535932416', {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false
                          }).catch(() => {});

                      }).catch(() => {});
                  }).catch(() => {});
                // remove the applicant role from the user and add member role
                applicantMember
                  .removeRole(myConfig.applicantRoleID)
                  .then(() => {
                    // add the member role
                    applicantMember .addRole(myConfig.trialRoleID).catch(() => {});
                  }).catch(() => {});

              } else if (message.content === "!app decline") {
                // Lets decline the app and do a few things
                /*
                  - Send DM to user
                  - Sends message to channel
                  - Moves channel to archive category
                  - Removes applicant role on the user
                */
                message.channel
                  .send(
                    "App declined by an officer. Archiving channel and sending a DM to the applicant letting them know the status of the app."
                  )
                  .then(() => {
                    // send DM with app status
                    applicantMember.send(
                      `Hi ${applicantMember.user}. As you know by now, we've declined your application and this message is to alert you that we have closed your application. You won't be removed from our Discord, and we invite you to stay as long as you want. We wish you luck in your guild hunt, and if you have any more questions I'm here to answer anything you can think of. Just toss me a DM @ Daemios#1918. Additionally, if the issues mentioned in your app are resolved at some point in the future, we'd love to have you re-apply.`
                    ).catch(() => {});

                    // lets archive the channel under the archive header instead of deleting it
                    // channel category we are going to make a channel under
                    let archiveCategory = "archive";
                    // get the channel object for the name above
                    let archiveChannel = guild.channels.find("name", archiveCategory);
                    logChannel.send(
                      `\`\`\`` +
                      `Moving ${message.channel.name} to archive becuase the app was declined. \n` +
                      `Removing applicant role on ${applicantMember.user} becuase the app was declined. ` +
                      `\`\`\``
                    ).catch(() => {});
                    message.channel.send(
                      `Moving channel to archive.`
                    ).catch(() => {});
                    message.channel.setParent(archiveChannel, "App Declined - " + message.channel.name).catch(() => {});
                    applicantMember.removeRole(myConfig.applicantRoleID).catch(() => {});

                    /*
                    //applicantMember.send("I'm sorry, but your application to Baddies has been declined by an officer. Feel free to hang around in #general, but the applicant role has been removed.")
                    message.channel
                      .delete("App Declined - " + message.channel.name)
                      .then(() => {
                        // remove the applicant role
                        applicantMember
                          .removeRole(myConfig.applicantRoleID)
                          .then(() => {})
                          .catch(console.error());
                      })
                      .catch(console.error());
                    */
                  })
                  .catch(console.error());
              }
            }
          }
        });
      } catch (e) {
        console.log(e)
      }
    }
  }
});

bot.on("guildMemberAdd", member => {
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    for (var i = 0; i < possibleAppTags.length; i++) {
      if (
        member.user.username === possibleAppTags[i][0] &&
        member.user.discriminator === possibleAppTags[i][1]
      ) {
        console.log(
          member.user.id +
          " username of " +
          member.user.username +
          "#" +
          member.user.discriminator +
          " matched user we are looking for " +
          possibleAppTags[i][0] +
          "#" +
          possibleAppTags[i][1]
        );
        //member.send(`@${member.user.username}#${member.user.discriminator} We've been looking for you, welcome to the Baddies US-Stormreaver discord server. You'll be automatically moved to your application discussion shortly.`);
        createApplicantUserChannel(member, i);
      }
    }
    //console.log(guild.roles);
  }
});

const checkOfficer = (member, message) => {
  //console.log(member.roles);
  //message.channel.send('ran check roles');
  //467121525535932416 - Robot Tester
  //202891360150355969 - The Law
  //198602464969097216 - The Left and Right Hand of The Law

  // look for the three roles mentioned above in comments to check "officer" status
  if (
    member.roles.some(r => [
      "467121525535932416",
      "202891360150355969",
      "198602464969097216"
    ].includes(r.id))
  ) {
    // has one of the roles
    //message.channel.send(`${member.user} has sufficent roles to run "officer" level commands.`);
    return true;
  } else {
    // has none of the above roles
    //message.channel.send(`${member.user} DOES NOT have sufficent roles to run "officer" level commands.`);
    return false;
  }
};

const checkUserOnServer = (discordName, discordDiscriminator) => {
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  let members = guild.members;
  members.filter(m => m.presence.status === "online");
  //console.log(members);
  if (guild.available) {
    for (var i in members.array()) {
      member = members.array()[i];
      if (
        member.user.username === discordName &&
        member.user.discriminator === discordDiscriminator
      ) {
        console.log(
          member.user.id +
          " username of " +
          member.user.username +
          "#" +
          member.user.discriminator +
          " matched against " +
          discordName +
          "#" +
          discordDiscriminator +
          " already on the server"
        );
        //member.send(`@${member.user.username}#${member.user.discriminator} We've been looking for you, welcome to the Baddies US-Stormreaver discord server. You'll be automatically moved to your application discussion shortly.`);
        //createApplicantUserChannel(member, i);
        //console.log(member);
        return member;
      }
    }
  }

  return false;
};

const createApplicantUserChannel = (member, i) => {
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  //console.log(possibleAppTags[i]);
  let _this = this;
  if (guild.available) {
    const logChannel = guild.channels.find('name', 'bot-testing');
    const channelName = possibleAppTags[i][2];
    const formattedTag = possibleAppTags[i][2];
    const permissions = [{
        //This is the @everyone role
        id: "196205829630722049",
        type: "role",
        deny: 3072,
        allow: 0
      },

      {
        //This is the members role
        id: "198602704447078400",
        type: "role",
        deny: 0,
        allow: 117760
      },

      {
        //This is the Robot Tester role
        id: "467121525535932416",
        type: "role",
        deny: 0,
        allow: 117760
      }
    ];

    // channel category we are going to make a channel under
    let appCategory = "applications";
    // get the channel object for the name above
    let appChannel = guild.channels.find("name", appCategory);
    // we check for spaces and ' in nicks and channel names and remove them
    let channelNameFormatted = channelName.replace(/ /g, "-").replace(/'/g, "").toLowerCase();
    let nicknameFormatted = possibleAppTags[i][2].replace(/ /g, "-").replace(/'/g, "");
    // gets if the channel exists or not
    let channelNameCheck = guild.channels.find("name", channelNameFormatted);
    // debug logging bot #bot-testing channel
    logChannel.send(`\`\`\`Attempting to create channel ${channelNameFormatted} through the bot using createApplicantUserChannel()\`\`\``).catch(() => {});
    //console.log(channelNameCheck);

    if (channelNameCheck != null) {
      console.log(
        "Channel for this name (" +
        channelNameFormatted +
        ") already exists. Prompting channel for an update."
      );
      channelNameCheck
        .send(
          `${
            member.user
          }, there was an attempt to post a new app with the same name as this channel. ACCESS DENIED. Please type \"!app yes\" to post an updated version here if this was your intention.`
        )
        .then(() => {
          channelNameCheck
            .awaitMessages(m => m.content === "!app yes", {
              max: 1,
              time: 30000,
              errors: ["time"]
            })
            .then(collected => {
              //console.log(collected);
              output = "";
              for (
                var j = 0, len = possibleAppTags[i][3].length; j < len; j++
              ) {
                output += "**" + possibleAppTags[i][3][j]["name"] + "** \n";
                output += possibleAppTags[i][3][j]["value"] + "\n\n";
              }
              channelNameCheck
                .send(output, {
                  split: true
                })
                .then(() => {
                  possibleAppTags.splice(i, 1);
                })
                .catch(console.error);
            })
            .catch(() => {
              console.log(
                "There was no collected message that passed the filter within the time limit."
              );
              channelNameCheck
                .send(
                  "We did not hear back from you in a timely manner. Please post an updated app on the website again and then check back here."
                )
                .then(() => {})
                .catch(console.error());
              possibleAppTags.splice(i, 1);
            });
        })
        .catch(console.error());
      return false;
    }
    //console.log(appChannel);
    guild
      .createChannel(channelName, "text", permissions)
      .then(channel => {
        channel
          .setParent(appChannel)
          .then(() => {
            //channel.send(`@everyone New application please review.`);
            member
              .addRole(myConfig.applicantRoleID)
              .then(member => {
                channel
                  .overwritePermissions(member, {
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true,
                    EMBED_LINKS: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true
                  })
                  .then(() => {
                    member
                      .setNickname(nicknameFormatted)
                      .then(() => {})
                      .catch(console.error());

                    //channel.send(`Hello ${applicant.user}, we've been looking for you. Welcome to the Baddies US-Stormreaver discord server.`);
                    //channel.send(`${applicant.user} Thanks for applying to Baddies. You can find your application posted here shortly (if not instantly). This thread will be used for app discussion. Please feel free to ask any questions.`)
                    //channel.send(`${applicant.user}, the rest of your application will be carried out here. You don't have to worry about the site anymore, but if you'd like to update your application you can go back to your saved progress and update any missing info and this post will automatically update. We'll message you here with any questions we have. Welcome to the Baddies discord!`)
                    channel
                      .send(
                        `${member.user}, the rest of your application will be carried out here. You don't have to worry about the site anymore. We'll message you here with any questions we have. Welcome to the Baddies discord!`
                      )
                      .then(() => {
                        output = "\n";
                        for (
                          var j = 0, len = possibleAppTags[i][3].length; j < len; j++
                        ) {
                          if (possibleAppTags[i][3][j]["name"] != undefined) {
                            output += "**" + possibleAppTags[i][3][j]["name"] + "** \n";
                          }
                          output += possibleAppTags[i][3][j]["value"] + "\n\n";
                        }
                        channel
                          .send(output, {
                            split: true
                          })
                          .then(() => {
                            possibleAppTags.splice(i, 1);
                          })
                          .catch(console.error);
                      })
                      .catch(console.error);
                  })
                  .catch(console.error);
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
};

/*
app.get('/discord/receiveUserInfoFromApp2/:discordName/:discordNumber/:charName', (request, response) => {
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
*/

app.post("/discord/receiveUserInfoFromApp", (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;
  console.log("Request received from client" + request);


  //console.log(headers);
  //console.log(method);
  //console.log(url);

  // Alias data from client
  const appData = request.body.app_data;
  const discordName = request.body.discord_name;
  const discordDiscriminator = request.body.discord_discriminator;
  const channelName = request.body.channel_name;

  logChannel = guild.channels.find('name', 'bot-testing');
  logChannel.send(`-------------------------------------------------------`).catch(() => {});
  logChannel.send(
    `\`\`\`` +
    `Received information from the website to create an application using receiveUserInfoFromApp() \n` +
    `Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName.replace(/ /g, "-").replace(/'/g,"").toLowerCase()}` +
    `\`\`\``
  ).catch(() => {});
  //logChannel.send(`\`\`\`Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName.replace(/ /g, "-").toLowerCase()}\`\`\``).catch(() => {});

  // Authenticate token
  var authHeader = request.headers.authorization.split(" ");
  var token = authHeader[1];
  try {
    var decoded = jwt.verify(token, myConfig.secretKey);
    if (decoded) {
      console.log("Verified token");
    }
  } catch (err) {
    console.log(err);
    //logChannel.send(`\`\`\`JWT invalid. Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName}\`\`\``).catch(() => {});
    //logChannel.send(`\`\`\`${err}\`\`\``).catch(() => {});
    logChannel.send(
      `\`\`\`` +
      `JWT invalid. Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName} \n` +
      `${err}` +
      `\`\`\``
    ).catch(() => {});
    response.send("Invalid Token");
  }

  // If guild is available
  if (guild.available) {
    // Initialize duplicate variable
    dupe = false;

    //iterate through existing array to see if the app is a duplicate, if so replace it

    // Iterate through possible apps
    for (var i = 0; i < possibleAppTags.length; i++) {
      if (
        discordName === possibleAppTags[i][0] &&
        discordDiscriminator === possibleAppTags[i][1]
      ) {
        console.log(
          "Dupe app already received with that ID " +
          discordName +
          "#" +
          discordDiscriminator +
          ". We should replace the app."
        );
        possibleAppTags[i] = [
          discordName,
          discordDiscriminator,
          channelName,
          appData
        ];
        response.send(
          JSON.stringify({
            success: true
          })
        );
        dupe = true;
      }
    }

    if (!dupe) {
      possibleAppTags.push([
        discordName,
        discordDiscriminator,
        channelName,
        appData
      ]);
      response.setHeader("Content-Type", "application/json");
      //console.log(response);
      try {
        try {
          member = checkUserOnServer(discordName, discordDiscriminator);
        } catch (err) {
          console.log(err);
        }
        if (member != false) {
          console.log(
            "User " +
            discordName +
            "#" +
            discordDiscriminator +
            " already on the server. Sending create channel data."
          );
          i = possibleAppTags.length - 1;
          createApplicantUserChannel(member, i);
        } else {
          logChannel.send(`User not found on server NOT creating channel yet. ${discordName}#${discordDiscriminator}`).catch(() => {});
          throw "Member not found on server. Continuing.";
        }
      } catch (err) {
        console.log(err);
      }

      response.send(
        JSON.stringify({
          success: true
        })
      );
    }
  }
});

app.post("/discord/checkUserOnServer", (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;

  //console.log("--- HEADERS ---");
  //console.log(headers);
  //console.log("--- METHOD ---");
  //console.log(method);
  //console.log("--- URL ---");
  //console.log(url);
  //console.log("--- BODY ---");
  //console.log(request.body);

  const discordName = request.body.discord_name;
  const discordDiscriminator = request.body.discord_discriminator;

  // Initialize found member & whether the user is found or not
  var member = false;
  var found = false;

  //try {

  try {
    member = checkUserOnServer(discordName, discordDiscriminator);
  } catch (err) {
    console.log("Error running checkUserOnServer");
    console.log(err.message);
  }

  // If the member is found
  if (member != false) {
    console.log(
      "User " +
      discordName +
      "#" +
      discordDiscriminator +
      " found on server. Reporting to client."
    );

    found = true;
  } else {
    throw "Member not found on server. Continuing.";
  }

  /*
  } catch (err) {
    console.log(err.message);
    console.log("--- Error thrown checking for user on server ---");
  }*/

  response.send(
    JSON.stringify({
      success: found
    })
  );
});

app.get("/discord/receiveInsightURLToPostToChannel", (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {}
});

app.get("/discord/sendJWT", (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;

  //console.log(headers);

  // get the client ip; since we are behind CF we need to check those headers as well
  var ip =
    request.headers["cf-connecting-ip"] ||
    (request.headers["x-forwarded-for"] ?
      request.headers["x-forwarded-for"].split(",")[0] :
      null) ||
    request.connection.remoteAddress;

  if (/^::ffff:(.*)$/.test(ip)) {
    // address is ipv4, let's strip ipv6 code off
    ip = ip.replace("::ffff:", "");
  } else {
    // address is ipv6, do nothing
  }

  let payload = {
    "user-agent": headers["user-agent"],
    ip: ip
  };

  try {
    var token = jwt.sign(payload, myConfig.secretKey, {
      expiresIn: 259200 // expires in 72 hours
      //expiresIn: 259200 // expires in 72 hours
    });
    console.log(
      "Created token for ip " + ip + " user agent " + headers["user-agent"]
    );
  } catch (err) {
    console.log(err);
    response.send("");
  }

  response.setHeader("Content-Type", "application/json");
  //console.log(response);
  response.send(
    JSON.stringify({
      token: token
    })
  );
});

app.get("/discord", (req, res) => {
  //res.send("Baddies-Application-Discord-Bot");
});

app.get("/discord/callback", (req, res) => {
  //Handle Discord Request URI?
});

bot.login(myConfig.discordKey);

server.listen(app.get("serverPort"));
console.log("Listening on port", app.get("serverPort"));