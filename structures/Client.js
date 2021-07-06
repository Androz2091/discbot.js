const { Client, Collection } = require("discord.js"),
util = require("util"),
path = require("path");

// Creates Atlanta class
class Atlanta extends Client {

    constructor (options) {
        super(options);
        this.config = require("../config"); // Load the config file
        this.commands = new Collection(); // Creates new commands collection
        this.aliases = new Collection(); // Creates new command aliases collection
        this.logger = require("../helpers/logger"); // Load the logger file
        this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
        this.guildsData = require("./Guild"); // Mongoose model
        this.permissions = require("../helpers/permissions"); // Permissions levels
    }

    // This function is used to load a command and add it to the collection
    loadCommand(commandPath, commandName){
        try {
            const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
            props.conf.location = commandPath;
            if(props.init) props.init(this);
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach((alias) => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    // This function is used to unload a command (you need to load them again)
    async unloadCommand (commandPath, commandName) {
        let command;
        if(this.commands.has(commandName)) command = this.commands.get(commandName);
        else if(this.aliases.has(commandName)) command = this.commands.get(this.aliases.get(commandName));
        if(!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        if(command.shutdown) await command.shutdown(this);
        delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }

    // This function is used to find a guild data or create it
    async findOrCreateGuild(param, isLean){
        let guildsData = this.guildsData;
        return new Promise(async function (resolve, reject){
            let guildData = (isLean ? await guildsData.findOne(param).lean() : await guildsData.findOne(param));
            if(guildData){
                resolve(guildData);
            } else {
                guildData = new guildsData(param);
                await guildData.save();
                resolve(guildData.toJSON());
            }
        });
    }

    getLevel(message) {
		let permlvl = 0;
		const permOrder = this.permissions.slice(0).sort((p, c) => c.level - p.level);
		while (permOrder.length) {
			const currentLevel = permOrder.shift();
			if(message.guild && currentLevel.guildOnly) continue;
			if(currentLevel.check(message)) {
				permlvl = currentLevel.level;
				break;
			}
		}
		return permlvl;
    }

}

module.exports = Atlanta;