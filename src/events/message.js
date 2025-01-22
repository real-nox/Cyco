const { config } = require("dotenv");
const { IsAdmin, IsModerator } = require("../handler/rolesHandler");
config();

module.exports = {
    name: "messageCreate",

    /**
    * @param {import("discord.js").Message} msg
    * @param {import("discord.js").Client} client
    */

    async execute(msg, client) {
        if (!msg.content.startsWith("!")) return;
        const args = msg.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            msg
            const owneruser = client.users.cache.get(process.env.CYCO_OWNER)
            //Owner filter
            if (command.owner) {
                if (!owneruser) {
                    const Error_Owner = "⛔ | Oops! You aren't the Owner of this bot to use this command!"
                    const { Error_Embed } = ErrorHandler(client, msg, Error_Owner, true)

                    return msg.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            //admin filter
            if (command.admin) {
                if (!(owneruser || IsAdmin(msg.member))) {
                    const Error_Admin = "⛔ | Oops! You don't have permissions for that! Please contact our support.";
                    const { Error_Embed } = ErrorHandler(client, msg, Error_Admin, true);

                    return msg.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            //moderation filter
            if (command.moderator) {
                if (!(owneruser || IsAdmin(msg.member) || IsModerator(msg.member))) {
                    const Error_Mod = "⛔ | Oops! You don't have permissions for that! Please contact our support."
                    const { Error_Embed } = ErrorHandler(client, msg, Error_Mod, true)

                    return msg.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            command.execute(msg, args, client);
        } catch (error) {
            console.error(error);
            msg.reply("There was an error executing that command!");
        }
        if (msg.content === "!Link") {
            return msg.reply("https://discord.com/oauth2/authorize?client_id=1307796361252704326")
        }
    }
}