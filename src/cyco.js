const { Client, WebhookClient, Collection, GatewayIntentBits } = require("discord.js")
const { config } = require("dotenv");
const { LoadEvents } = require("./handler/eventHandler");
const { LoadCommands } = require("./handler/commandHandler");
const { LoadDatabase } = require("./handler/databaseHandler");
require("colors")
config();

const bot = new Client({
    intents: [Object.keys(GatewayIntentBits)],
})

bot.commands = new Collection();

bot.login(process.env.CYCO_TOKEN).then(() => {
    LoadCommands(bot);
    LoadEvents(bot);
    LoadDatabase(bot);

}).catch(async (err) => {
    const ErrorHook = new WebhookClient({ url: process.env.WEBHOOK })

    await ErrorHook.send({
        content: `${err}`,
    });
    console.log("[ERROR]".red, err)
})