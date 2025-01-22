const { PermissionFlagsBits } = require("discord.js");
const { WebhookHandler } = require("./errorHandler")
require("colors")

function IsAdmin(member) {
    try {
        if (
            member.permissions.has(PermissionFlagsBits.Administrator) ||
            member.permissions.has(PermissionFlagsBits.ManageChannels) ||
            member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            return true;
        } else {
            return false;
        }

    } catch (err) {
        WebhookHandler(err)
        console.log("[ERROR]".red, err)
    }
}

function IsModerator(member) {
    try {
        if (
            IsAdmin(member) ||
            member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
            member.permissions.has(PermissionFlagsBits.ManageNicknames) ||
            member.permissions.has([
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.DeafenMembers
            ])
        ) {
            return true;
        } else {
            return false;
        }

    } catch (err) {
        WebhookHandler(err)
        console.log("[ERROR]".red, err)
    }
}

function IsPremium(member) {
    try {

    } catch (err) {
        WebhookHandler(err)
        console.log("[ERROR]".red, err)
    }
}

function IsNormal(member) {
    try {
        if (!IsAdmin(member) && !IsModerator(member)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        WebhookHandler(err)
        console.log("[ERROR]".red, err)
    }
}

module.exports = { IsAdmin, IsModerator, IsPremium, IsNormal }