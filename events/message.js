const Discord = require("discord.js"),
cmdCooldown = {};

module.exports = class {

    constructor (client) {
        this.client = client;
    }

    async run (message) {

        const data = {};

        // If the message author is a bot
        if(message.author.bot) return;

        // If the member on a guild is invisible or not cached, fetch him
        if(message.guild && !message.member) await message.guild.members.fetch(message.author.id);

        let guildConf = (message.guild ? await this.client.findOrCreateGuild({ id: message.guild.id }) : { prefix: "", language: this.client.config.guildConf.language });
        data.guildConf = guildConf;
        data.config = this.client.config;

        // Gets language
        let Language = require(`../languages/${guildConf.language}.js`);
        message.language = new Language();

        // Check if the bot was mentionned
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if(message.content.match(prefixMention)) return message.reply(message.language.get("PREFIX_INFO", guildConf.prefix));

        // Gets the prefix
        let prefixes = [ guildConf.prefix, this.client.user.username, "<@"+this.client.user.id+">" ];
        let prefix = (message.channel.type !== "dm" ? prefixes.find((p) => message.content.startsWith(p)) : "");
        if(!prefix && prefix !== "") return;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        let cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if(!cmd) return;
        data.cmd = cmd;

        if(cmd.conf.guildOnly && !message.guild){
            return message.channel.send(message.language.get("ERR_CMD_GUILDONLY"));
        }

        if(message.guild){

            /* Client permissions */
            const neededPermissions = [];
            cmd.conf.clientPermissions.forEach((permission) => {
                if(!message.channel.permissionsFor(message.guild.me).has(permission)) {
                    neededPermissions.push(permission);
                }
            });
            if(neededPermissions.length > 0) return message.channel.send(message.language.get("ERR_CMD_CLIENT_PERMISSIONS", neededPermissions));

            /* User permissions */
            const permLevel = await this.client.getLevel(message);
            if(permLevel < cmd.conf.permLevel){
                let levelName = message.language.get("PERM_LEVELS")[cmd.conf.permLevel];
                let userLevel = message.language.get("PERM_LEVELS")[permLevel];
                return message.channel.send(message.language.get("ERR_CMD_USER_PERMISSIONS", levelName, userLevel));
            }
            
            /* NSFW */
            if(!message.channel.nsfw && cmd.conf.nsfw){
                return message.channel.send(language.get("ERR_CMD_NSFW"));
            }
        }

        if(!cmd.conf.enabled){
            return message.channel.send(language.get("ERR_CMD_DISABLED"));
        }

        /* Cooldown */
        let uCooldown = cmdCooldown[message.author.id];
        if(!uCooldown){
            cmdCooldown[message.author.id] = {};
            uCooldown = cmdCooldown[message.author.id];
        }
        let time = uCooldown[cmd.help.name] || 0;
        if(time && (time > Date.now())){
            return message.channel.send(message.language.get("ERR_CMD_COOLDOWN", Math.ceil((time-Date.now())/1000)));
        }
        cmdCooldown[message.author.id][cmd.help.name] = Date.now() + cmd.conf.cooldown;

        this.client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
        try {
            cmd.run(message, args, data);
        } catch(e){
            console.error(e);
            return message.channel.send(message.language.get("ERR_OCCURRED"));
        }
    }
};