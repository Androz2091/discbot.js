const path = require("path");

module.exports = class Command {
    constructor(client, {
        // The name of the command
        name = null,
        // Whether the command is enabled, or not
        enabled = true,
        // Some command informations to display in the help command
        description = (language) => language.get("NO_DESCRIPTION_PROVIDED"),
        usage = (language) => language.get("NO_USAGE_PROVIDED"),
        examples = (language) => language.get("NO_EXAMPLES_PROVIDED"),
        // The other names that can trigger the command 
        aliases = new Array(),
        // The permissions needed by the bot to run the command
        clientPermissions = new Array(),
        // The level of permissions required by the user to run the command. Permissions list can be found in the README
        permLevel = 0,
        // The time it will take a user before he can execute the command again
        cooldown = 5000,
        // The file path of the command. It will be used to determine what's the command category
        commandPath = null,
        // Whether the command can only be run in a guild, or not
        guildOnly = false,
        // Whether the command needs to be run in a NSFW channel
        nsfw = false
    })
    {
        let category = (commandPath ? commandPath.split(path.sep)[parseInt(commandPath.split(path.sep).length-1, 10)] : "Other");
        this.client = client;
        this.conf = { enabled, aliases, permLevel, clientPermissions, cooldown, guildOnly, nsfw };
        this.help = { name, description, usage, examples, category };
    }
};