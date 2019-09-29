const mongoose = require("mongoose"),
config = require("../config");

module.exports = mongoose.model("Guild", new mongoose.Schema({
    language: { type: String, default: config.guildConf.language },
    prefix: { type: String, default: config.guildConf.prefix }
}));