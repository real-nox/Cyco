const { Schema, model } = require("mongoose");

let Moderation = new Schema({
    name: String,
})

const User_Logs = model('user_logs', Moderation)

module.exports = { User_Logs }