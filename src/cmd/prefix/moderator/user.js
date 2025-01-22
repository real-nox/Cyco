const { EmbedBuilder } = require("discord.js");
const { User_Logs } = require("../../../data/moderationDB");
const { getModLogs } = require("../../../function/modlogs");

module.exports = {
    moderator: true,
    name: "user",

    /**
     * @param {import("discord.js").Message} msg
     * @param {import("discord.js").Client} client
     */

    async execute(msg, args, client) {
        try {
            const commandArgs = msg.content.split(" ");
            const userId = commandArgs[1];

            if (!userId) {
                return msg.reply("❌ Please provide a user ID to check.");
            }

            const member = await fetchUser(client, userId);
            const guild = await fetchGuild(client, msg.guildId);

            if (!member) {
                return msg.reply("❌ Could not find the user. Please ensure the ID is correct.");
            }

            if (!guild) {
                return msg.reply("❌ Could not find the guild. Please ensure the bot is in the server.");
            }

            const guildMember = await guild.members.fetch(member.id).catch(() => null);
            const modlogs = await getModLogs(guild, guildMember || member);

            let roles = null

            if (guildMember)
                roles = await RolesGuild(guildMember)

            const embed = buildWhoisEmbed(member, roles, modlogs);
            await msg.reply({ embeds: [embed] });

            saveUserToDatabase(member.username);
        } catch (err) {
            console.error("An error occurred:", err);
            msg.reply("❌ An unexpected error occurred while processing the request.");
        }
    },
};

async function fetchUser(client, userId) {
    return client.users.fetch(userId).catch(() => null);
}

async function fetchGuild(client, guildId) {
    return client.guilds.fetch(guildId).catch(() => null);
}

async function RolesGuild(member) {
    let roles
    return roles = member.roles.cache
        .filter((role) => role.name !== "@everyone")
        .map((role) => `<@&${role.id}>`)
        .join(", ") || "No roles assigned.";
}

function buildWhoisEmbed(member, roles, modlogs) {
    const embed = new EmbedBuilder()
        .setThumbnail(member.avatarURL())
        .setTitle("User Information")
        .addFields({
            name: "User Details:",
            value: `- Username: ${member.username}\n- ID: \`${member.id}\`\n- Created: <t:${Math.floor(
                member.createdTimestamp / 1000
            )}>\n- [Avatar](${member.avatarURL()})\n- Mention: ${member}`,
        })
        .setColor("Blue");

    if (modlogs) {
        embed.addFields({ name: "Moderation Logs:", value: modlogs });
    }

    if (roles) {
        embed.addFields({
            name: "Roles :",
            value: roles,
        });
    }

    return embed;
}

async function saveUserToDatabase(username) {
    try {
        const existingUser = await User_Logs.findOne({ name: username });

        if (existingUser) {
            console.log("User already exists in the database.");
            return;
        } else {
            await User_Logs.create({ name: username });
            console.log("Successfully saved user to database:", username);
        }
    } catch (err) {
        console.error("Error saving user to database:", err);
    }
}
