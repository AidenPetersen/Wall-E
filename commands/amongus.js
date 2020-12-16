const { MessageEmbed } = require("discord.js");
const { consoleChannel, userIDs } = require(`../config.json`);

module.exports = {

    name: `amongus`,
    aliases: [`aus`],
    description: `Among Us Game Manager`,
    usage: `OR ~amongus [lobby code]`,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        msgDescription = `React with the following to mute/unmute people during rounds!`;
        if (args[0] && args[0].length == 6) msgDescription += `\n\nGame Code: \`${args[0]}\``

        const amongUs = new MessageEmbed()
            .setAuthor(`Among Us Game Manager`, `https://preview.redd.it/an871k4o1sn51.png?width=440&format=png&auto=webp&s=85dcd6cb73b8760802e254ee14dfa3c7ab444591`)
            .setTitle(`Welcome to the Among Us Game Manager`)
            .setDescription(msgDescription)
            .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))


        message.channel.send(amongUs).then(auMsg => {
            auMsg.react(`🔈`);
            auMsg.react(`🔇`);
            auMsg.react(`❌`);

            const unmute = (reaction, user) => { return reaction.emoji.name == '🔈' && user.id != userIDs.walle; };
            const mute = (reaction, user) => { return reaction.emoji.name == '🔇' && user.id != userIDs.walle; };

            // unmute all players in vc
            const unmuteCollector = auMsg.createReactionCollector(unmute);
            unmuteCollector.on('collect', (reaction, user) => {

                // user is not in a VC, reset embed reactions
                if(!message.guild.members.cache.get(user.id).voice.channelID) {
                    auMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    auMsg.react(`🔈`);
                    auMsg.react(`🔇`);
                    auMsg.react(`❌`);
                    return;
                }

                message.member.voice.channel.members.forEach(function (guildMemberId) {
                    guildMemberId.voice.setMute(false);
                })
                auMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                auMsg.react(`🔈`);
                auMsg.react(`🔇`);
                auMsg.react(`❌`);
            });

            // mute all players in vc
            const muteCollector = auMsg.createReactionCollector(mute);
            muteCollector.on('collect', (reaction, user) => {

                // user is not in a VC, reset embed reactions
                if(!message.guild.members.cache.get(user.id).voice.channelID) {
                    auMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    auMsg.react(`🔈`);
                    auMsg.react(`🔇`);
                    auMsg.react(`❌`);
                    return;
                }

                message.member.voice.channel.members.forEach(function (guildMemberId) {
                    guildMemberId.voice.setMute(true);
                })
                auMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                auMsg.react(`🔈`);
                auMsg.react(`🔇`);
                auMsg.react(`❌`);
            });

            const deleteFilter = (reaction, user) => { return reaction.emoji.name == '❌' && user.id == message.author.id; };
            // reaction collector to delete the help embed & log event to console
            const collectorDelete = auMsg.createReactionCollector(deleteFilter);
            collectorDelete.on('collect', (reaction, user) => {
                auMsg.delete()
                    .then(msg => {
                        console.log(`Deleted \`Among Us Game Manager\`, requested by \`${uName}\``)
                        message.client.channels.cache.get(consoleChannel).send(`Deleted Among Us Game Manager, requested by \`${uName}\``);
                    })
                    .catch(console.error);

                // Delete passed command & log deletion in console
                message.delete()
                    .then(msg => {
                        console.log(`Deleted '${message}' from ${uName}`)
                        message.client.channels.cache.get(consoleChannel).send(`Deleted \`${message}\` from \`${uName}\``);
                    })
                    .catch(console.error);
            });


        })
    },
};