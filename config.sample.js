module.exports = {

    /* YOUR DISCORD BOT TOKEN */
    token: "Your Discord Bot Token here",

    /* DEFAULT GUILD CONFIGURATION */
    guildConf: {
        language: "english",
        prefix: "disc!"
    },
    
    /* THE MONGODB URL */
    mongoDB: "mongodb://localhost:27017/Discbot",

    /* EMOJIS STRINGS LIKE <:emojiName:emojiID> */
    emojis: {
        success: "XXXXXXXXX",
        error: "XXXXXXXXX",
        loading: "XXXXXXXXX"
    },

    /* ARRAY OF BOT'S OWNERS IDs */
    owners: [ ],

    /* STATUS LIST (Playing to... or listen to...) */
    status: {
        updateEvery: 20000,
        list: [
            {
                type: "PLAYING",
                content: "On {guildsCount} servers!"
            },
            {
                type: "LISTENING",
                content: "{usersCount} users"
            }
        ]
    }

};