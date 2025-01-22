const { config } = require("dotenv");
const { WebhookHandler } = require("./errorHandler")
const mongoose = require('mongoose');
require("colors");
config();

function LoadDatabase(client) {
    try {

        mongoose.connect(process.env.DB_URI)
            .then(() => console.log("[DATABASE]".yellow, "Database started."))
            .catch((err) => WebhookHandler(err))

    } catch (err) {
        console.log("[ERROR]".red, err)
        WebhookHandler(err)
    }
}

module.exports = { LoadDatabase }