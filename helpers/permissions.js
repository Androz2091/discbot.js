const config = require("../config");

module.exports = [
    {
        level: 0,
        check: () => true,
    },
    {
        level: 1,
        check: (message) => (message.guild ? message.member.hasPermission("MANAGE_MESSAGES") : false),
    },
    {
        level: 2,
        check: (message) => (message.guild ? message.member.hasPermission("ADMINISTRATOR") : false),
    },
    {
        level: 3,
        check: (message) => (message.guild ? message.author.id === message.guild.ownerID : false),
    },
    {
        level: 5,
        check: (message) => config.owners.some((o) => o === message.author.id),
    },
];