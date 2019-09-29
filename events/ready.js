const Discord = require("discord.js");

module.exports = class {

    constructor (client) {
        this.client = client;
    }

    async run () {

        let client = this.client;

        // Logs some informations using the logger file
        client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "log");
        client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

        // Update bot's status

        const statusList = require("../config.js").status.list || [],
        version = require("../package.json").version;
        let i = 0;
        setInterval(() => {

            let status = statusList[parseInt(i, 10)];
            
            let statusContent = status.content
            .replace(/{usersCount}/g, client.users.size)
            .replace(/{guildsCount}/g, client.guilds.size);
    
            client.user.setActivity(statusContent, { type: status.type });
    
            if(statusList[parseInt(i+1, 10)]) i++
            else i = 0;

        }, require("../config.js").status.updateEvery);

    }
}  