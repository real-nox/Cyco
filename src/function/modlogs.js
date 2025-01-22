async function getModLogs(guild, member) {
    try {
        const modLogs = [];

        const banInfo = await fetchBanInfo(guild, member);
        if (banInfo) {
            modLogs.push(`🔨 **Banned**: ${banInfo.reason || "No reason provided."}`);
        } else {
            return
        }

        const guildMember = await guild.members.fetch(member.id).catch(() => null);
        if (!guildMember) {
            return
        }

        if (guildMember.communicationDisabledUntil) {
            modLogs.push(`⏳ **Timed Out Until**: ${guildMember.communicationDisabledUntil.toLocaleString()}`);
        } else {
            return
        }

        return modLogs.join("\n");
    } catch (error) {
        console.error("Error fetching moderation info:", error);
        return "❌ An error occurred while fetching moderation logs.";
    }
}

/**
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").User} member
 * @returns {Promise<{reason: string} | null>}
 */
async function fetchBanInfo(guild, member) {
    try {
        const banInfo = await guild.bans.fetch(member.id);
        console.log(`${member.tag} is banned for: ${banInfo.reason || "No reason provided."}`);
        return banInfo;
    } catch (error) {
        if (error.code === 10026) {
            console.log(`${member.tag} is not banned.`);
            return null;
        } else {
            console.error("Error fetching ban info:", error);
            throw error;
        }
    }
}

/**
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").User} member
 * @returns {Promise<Array>}
 */
async function fetchAuditLogs(guild, member) {
    const actionTypes = [22, 23, 24]
    const relevantLogs = [];

    try {
        for (const actionType of actionTypes) {
            const auditLogs = await guild.fetchAuditLogs({ type: actionType, limit: 10 });
            const filteredLogs = auditLogs.entries.filter((entry) => entry.target.id === member.id);

            filteredLogs.forEach((entry) => {
                relevantLogs.push({
                    action: entry.action,
                    executor: entry.executor,
                    createdAt: entry.createdAt,
                });
            });
        }
    } catch (error) {
        console.error("Error fetching audit logs:", error);
    }

    return relevantLogs;
}

module.exports = { getModLogs };
