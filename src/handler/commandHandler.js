const { WebhookHandler } = require("./errorHandler");
const ascii = require("ascii-table");
const fs = require("fs");
require("colors");

// ASCII table for logging
const table = new ascii().setHeading("File Name", "Type", "Status");

function LoadCommands(client) {
    try {
        let slashCommandsArray = [];
        let prefixCommandsArray = [];

        // --- Load Slash Commands ---
        const slashCommandsFolder = fs.readdirSync("./src/cmd/slash");
        for (const folder of slashCommandsFolder) {
            const commandFiles = fs
                .readdirSync(`./src/cmd/slash/${folder}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                try {
                    const commandFile = require(`../cmd/slash/${folder}/${file}`);
                    const properties = { folder, ...commandFile };

                    if (!commandFile.data?.name) {
                        table.addRow(file, "Slash", "Invalid (Missing name)");
                        continue;
                    }

                    client.commands.set(commandFile.data.name, properties);
                    slashCommandsArray.push(commandFile.data.toJSON());
                    table.addRow(file, "Slash", "Loaded");
                } catch (error) {
                    table.addRow(file, "Slash", "Unloaded");
                    WebhookHandler(error);
                }
            }
        }

        // Register slash commands globally
        client.application.commands.set(slashCommandsArray);

        // --- Load Prefix Commands ---
        const prefixCommandsFolder = fs.readdirSync("./src/cmd/prefix");
        for (const folder of prefixCommandsFolder) {
            const commandFiles = fs
                .readdirSync(`./src/cmd/prefix/${folder}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                try {
                    const commandFile = require(`../cmd/prefix/${folder}/${file}`);

                    if (!commandFile.name || !commandFile.execute) {
                        table.addRow(file, "Prefix", "Invalid (Missing name or execute)");
                        continue;
                    }

                    client.commands.set(commandFile.name, commandFile);
                    prefixCommandsArray.push(commandFile.name);
                    table.addRow(file, "Prefix", "Loaded");
                } catch (error) {
                    table.addRow(file, "Prefix", "Unloaded");
                    WebhookHandler(error);
                }
            }
        }

        // Log loaded commands
        console.log(
            table.toString(),
            "\n[+]".green + ` Loaded Slash Commands: ${slashCommandsArray.length}`,
            "\n[+]".green + ` Loaded Prefix Commands: ${prefixCommandsArray.length}`
        );
    } catch (error) {
        table.addRow("Unknown", "Error", "Unloaded");
        WebhookHandler(error);
    }
}

module.exports = { LoadCommands };
