const { EmbedBuilder } = require("discord.js");
const { config } = require("dotenv");
const { ErrorHandler } = require("../handler/errorHandler");
const { IsAdmin, IsModerator } = require("../handler/rolesHandler");
config();

module.exports = {
    name: "interactionCreate",

    /**
    * Handles interaction events.
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    */

    async execute(interaction, client) {
        const { customId, member, commandName, message } = interaction;

        const owneruser = client.users.cache.get(process.env.CYCO_OWNER)

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(commandName);

            /*async function isUserPremium(userId) {
                const codes = await Codes.finduser(userId, true)
                return codes
            }

            const isPremium = await isUserPremium(member.id);

            const embed = new EmbedBuilder()
                .setColor("White")
                .setAuthor({ name: "Premiul only", iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`Hold up! This command is for premium users only. You may use the commmand \`/premium \`.`)

            if (command.premiumOnly && (!isPremium || !ranox)) {
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                })
            }*/

            //Owner filter
            if (command.owner) {
                if (!owneruser) {
                    const Error_Owner = "⛔ | Oops! You aren't the Owner of this bot to use this command!"
                    const { Error_Embed } = ErrorHandler(client, interaction, Error_Owner, true)

                    return interaction.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            //admin filter
            if (command.admin) {
                if (!(owneruser || IsAdmin(member))) {
                    const Error_Admin = "⛔ | Oops! You don't have permissions for that! Please contact our support.";
                    const { Error_Embed } = ErrorHandler(client, interaction, Error_Admin, true);

                    return interaction.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            //moderation filter
            if (command.moderator) {
                if (!(owneruser || IsAdmin(member) || IsModerator(member))) {
                    const Error_Mod = "⛔ | Oops! You don't have permissions for that! Please contact our support."
                    const { Error_Embed } = ErrorHandler(client, interaction, Error_Mod, true)

                    return interaction.reply({ embeds: [Error_Embed], ephemeral: true });
                }
            }

            if (!command) {
                return interaction.reply({
                    content: "outdated command",
                    ephemeral: true,
                });
            }
            command.execute(interaction, client);
        }
    }
}