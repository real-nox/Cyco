const { EmbedBuilder, ChannelType, WebhookClient } = require("discord.js");
const { config } = require("dotenv");
config();
require("colors");

function WebhookHandler(err) {
    try {
        const ErrorHook = new WebhookClient({ url: process.env.WEBHOOK })

        const Error_Embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error Accrued")
            .setDescription(`${err}`)

        console.log("[ERROR]".red, err)

        return ErrorHook.send({
            embeds: [Error_Embed]
        });
    } catch (err) {
        console.error("[ERROR]".red, err)
    }
}

function ErrorHandler(client = null, type = null, err, check) {
    try {
        if (!check) {
            const Error_Channel = client.channels.cache.find(i => i.id === process.env.CHANNELERROR)

            const Error_Embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Error Accrued")
                .setDescription(`Error showed to : <@${type.member.id}>\n- In <#${type.channel.id}>\n- Link : ${type.message}\n\n${err}`)

            if (Error_Channel || Error_Channel.type === ChannelType.GuildText) {
                return Error_Channel.send({ embeds: [Error_Embed] })
            } else {
                return WebhookHandler(err);
            }
        } else {
            const Error_Embed = new EmbedBuilder().setColor("Red")
                .setDescription(err)

            return { Error_Embed };
        }
    } catch (err) {
        console.error("[ERROR]".red, err)
        return WebhookHandler(err);
    }
}

module.exports = { WebhookHandler, ErrorHandler }