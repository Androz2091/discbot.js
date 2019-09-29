const Command = require("../../structures/Command.js"),
Discord = require("discord.js");

class Ping extends Command {

    constructor (client) {
        super(client, {
            // The name of the command
            name: "ping",
            // Whether the command is enabled, or not
            enabled: true,
            // Some command informations to display in the help command
            description: (language) => language.get("PING_DESCRIPTION"),
            usage: (language) => language.get("PING_USAGE"),
            examples: (language) => language.get("PING_EXAMPLES"),
            // The other names that can trigger the command
            aliases: [ "pong", "latency" ],
            // The permissions needed by the bot to run the command
            clientPermissions: [],
            // The level of permissions required by the user to run the command.
            permLevel: 0,
            // // The time it will take a user before he can execute the command again
            cooldown: 1000,
            // The file path of the command. It will be used to determine what's the command category
            commandPath: __dirname,
            // Whether the command can only be run in a guild, or not
            guildOnly: false,
            // Whether the command needs to be run in a NSFW channel
            nsfw: false
        });
    }

    async run (message, args, data) {
        let m = await message.channel.send(message.language.get("PING_WAIT"));
        m.edit(message.language.get("PING_RESULT", m.createdTimestamp - message.createdTimestamp));
    }

}

module.exports = Ping;