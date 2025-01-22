const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("invite")
        .setDescription("Join the bot's Server."),

    async execute(interaction) {
        try {
            interaction.reply({ content: "Here is our Server's Invite : \n> https://discord.gg/e77VSNhsaU", ephemeral: true })
        } catch (err) {
            console.log(err);
        }
    },

};