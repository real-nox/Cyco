const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "setup",
    description: "Server",
    execute(message, args) {
        const setup_embed = new EmbedBuilder()
            .setTitle("Setup Cyco")
            .setDescription(`${message.guild.name} Cyco setup`)
        message.reply({ embeds: [setup_embed] });
    },
};
