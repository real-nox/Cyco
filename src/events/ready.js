const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        try {

            const activities = [` On ${client.guilds.cache.size} servers! `, "Use /help "];
            let i = 0;

            setInterval(() => client.user.setPresence({ activities: [{ name: activities[i++ % activities.length], type: ActivityType.Playing }] }), 15000);
            console.log(`[ONLINE]`.green + ` ${client.user.tag} is online in ${client.guilds.cache.size} servers! `);
        } catch (error) {
            console.log("Error showed in ready.js " + error)
        }
    },
};