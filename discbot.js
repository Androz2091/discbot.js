const util = require("util"),
fs = require("fs"),
mongoose = require("mongoose"),
readdir = util.promisify(fs.readdir),
permissions = require("./helpers/permissions");

// Load Client class
const Client = require("./structures/Client"),
client = new Client();

const init = async () => {

    // Searches and loads all commands in all categories
    let categories = await readdir("./commands/");
    client.logger.log(`Loading a total of ${categories.length} categories.`, "log");
    categories.forEach(async (cat) => {
        let commands = await readdir(`./commands/${cat}/`);
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            const response = client.loadCommand(`./commands/${cat}`, cmd);
            if(response) client.logger.log(response, "error");
        });
    });

    // Searches and loads all events, like the ready event
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    
    // connect to mongoose database
    mongoose.connect(client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        client.logger.log("Connected to the Mongodb database.", "log");
    }).catch((err) => {
        client.logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });

    client.login(client.config.token); // Log in to the discord api

};

init();

// if there are errors, log them
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", (err) => {
    client.logger.log("Uncaught Promise Error: "+err, "error");
});