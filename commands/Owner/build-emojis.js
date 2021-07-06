const Command = require("../../structures/Command.js"),
json = require("json-beautify"),
fs = require("fs"),
emojis = fs.readdirSync("./assets/img/emojis").map((e) => e.split("."));

const asyncForEach = async (array, callback) => {
    const results = [];
    for (let index = 0; index < array.length; index++) {
        let result = await callback(array[index], index, array);
        results.push(result);
    }
    return results;
}

const addEmojis = async (guild) => {
    return await asyncForEach(emojis, async (emojiData) => {
        return await guild.emojis.create(`./assets/img/emojis/${emojiData[0]}.${emojiData[1]}`, emojiData[0]);
    });
}

class BuildEmojis extends Command {

    constructor (client) {
        super(client, {
            // The name of the command
            name: "build-emojis",
            // Whether the command is enabled, or not
            enabled: true,
            // Some command informations to display in the help command
            description: (language) => language.get("BUILD_EMOJIS_DESCRIPTION"),
            usage: (language) => language.get("BUILD_EMOJIS_USAGE"),
            examples: (language) => language.get("BUILD_EMOJIS_EXAMPLES"),
            // The other names that can trigger the command
            aliases: [],
            // The permissions needed by the bot to run the command
            clientPermissions: [ "MANAGE_EMOJIS" ],
            // The level of permissions required by the user to run the command.
            permLevel: 4,
            // // The time it will take a user before he can execute the command again
            cooldown: 5000,
            // The file path of the command. It will be used to determine what's the command category
            commandPath: __dirname,
            // Whether the command can only be run in a guild, or not
            guildOnly: true,
            // Whether the command needs to be run in a NSFW channel
            nsfw: false
        });
    }

    async run (message, args, data) {
        let m = await message.channel.send(message.language.get("BUILD_EMOJIS_IN_PROGRESS"));
        let emojis = await addEmojis(message.guild);
        let toDisplay = {};
        emojis.forEach((e) => toDisplay[e.name] = e.toString());
        m.edit(message.language.get("BUILD_EMOJIS_INFOS")+"\n```Json\n"+json(toDisplay, null, 4, 100)+"```");
    }

}

module.exports = BuildEmojis;