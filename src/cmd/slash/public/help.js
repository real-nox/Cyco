const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("help")
        .setDescription("CYCO's help command."),

    async execute(interaction) {
        try {
            interaction.reply({ content: "This command is under development thanks for checking in.", ephemeral: true })
        } catch (err) {
            console.log(err);
        }
    },

};