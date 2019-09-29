const currentLanguage = "english",
c = require("../config.js"),
e = c.emojis;


// This class is used to store languages strings

module.exports = class {

    constructor() {
		this.language = {

            PERM_LEVELS: [
                "User",
                "Moderator",
                "Administrator",
                "Founder",
                "Ultimate"
            ],
            
            ERR_CMD_CLIENT_PERMISSIONS: (perms) => `${e.error} __**Missing permissions**__\n\nI need the following permissions for this command to work properly: ${perms.map((p) => "`"+p+"`").join(", ")}`,
            ERR_CMD_USER_PERMISSIONS: (levelName, userLevel) => `${e.error} | This command requires the level of permissions \`${levelName}\` (you are \`${userLevel}\`) !`,
            ERR_CMD_COOLDOWN: (time) => `${e.error} | Hey, keep calm! Wait **${time}** second(s) before performing this command again!`,
            ERR_CMD_NSFW: `${e.error} | This command must be executed in a NSFW channel!`,
            ERR_CMD_DISABLED: `${e.error} | This command is currently disabled!`,
            ERR_OCCURRED: `${e.error} | An error has occurred. Please try again in a few minutes!`,
            ERR_CMD_GUILDONLY: `${e.error} | This command is not available in private messages!`,

            PREFIX_INFO: (prefix) => `${e.success} | The prefix of this server is \`${prefix}\`!`,

            /* PING COMMAND */
            PING_DESCRIPTION: "Displays the bot latency!",
            PING_USAGE: "ping",
            PING_EXAMPLES: "$ping",
            PING_WAIT: `${e.loading} | Pinging...`,
            PING_RESULT: (ms) => `${e.success} | Pong! Latency: \`${ms}\` ms!`,

            /* BUILD EMOJIS COMMAND */
            BUILD_EMOJIS_DESCRIPTION: "Automatically adds the emojis necessary for the bot to work properly and generates a configuration!",
            BUILD_EMOJIS_USAGE: "build-emojis",
            BUILD_EMOJIS_EXAMPLES: "$build-emojis",
            BUILD_EMOJIS_IN_PROGRESS: `${e.success} | Adding emojis is in progress....`,
            BUILD_EMOJIS_INFOS: `${e.success} | Copy and paste this into your configuration!`
        }
    }

    /**
	 * The method to get language strings
	 * @param {string} term The string or function to look up
	 * @param {...*} args Any arguments to pass to the lookup
	 * @returns {string|Function}
	 */
	get(term, ...args) {
		const value = this.language[term];
		switch (typeof value) {
			case "function": return value(...args);
			default: return value;
		}
	}

	getLang(){
		return lang;
	}

	printDate(pdate, isLongDate){
        const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        let day = pdate.getDate(),
        monthIndex = pdate.getMonth(),
        year = pdate.getFullYear(),
        hour = pdate.getHours() < 10 ? "0" + pdate.getHours() : pdate.getHours(),
        minute = pdate.getMinutes() < 10 ? "0" + pdate.getMinutes() : pdate.getMinutes();

        let thedate = (isLongDate) ? day + " " + monthNames[monthIndex] + " " + year + " at " + hour + "h" + minute 
        : day + " " + monthNames[monthIndex] + " " + year
        return thedate;
	}
	
	/**
	 * Parse ms and returns a string
	 * @param {number} milliseconds The amount of milliseconds
	 * @returns The parsed milliseconds
	 */
	convertMs(milliseconds){
		let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
		let days = roundTowardsZero(milliseconds / 86400000),
		hours = roundTowardsZero(milliseconds / 3600000) % 24,
		minutes = roundTowardsZero(milliseconds / 60000) % 60,
		seconds = roundTowardsZero(milliseconds / 1000) % 60;
		if(seconds === 0) seconds++;
		let isDays = days > 0,
		isHours = hours > 0,
		isMinutes = minutes > 0;
		let pattern = 
		(!isDays ? "" : (isMinutes || isHours) ? "{days} days, " : "{days} days and ")+
		(!isHours ? "" : (isMinutes) ? "{hours} hours, " : "{hours} hours and ")+
		(!isMinutes ? "" : "{minutes} minutes and ")+
		("{seconds} seconds");
		let sentence = pattern
        .replace("{duration}", pattern)
        .replace("{days}", days)
        .replace("{hours}", hours)
        .replace("{minutes}", minutes)
        .replace("{seconds}", seconds);
		return sentence;
	}

}