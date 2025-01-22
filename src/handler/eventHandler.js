const { WebhookHandler } = require("./errorHandler")
const ascii = require('ascii-table');
const fs = require('fs');
const table = new ascii().setHeading('Events', 'Status');
require("colors");

function LoadEvents(client) {
    try {
        const fs = require('fs');

        const files = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

        for (const file of files) {
            try {
                const event = require(`../events/${file}`);

                if (event.rest) {
                    if (event.once) {
                        client.rest.once(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    } else {
                        client.rest.on(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    }
                } else {
                    if (event.once) {
                        client.once(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    } else {
                        client.on(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    }
                }
                table.addRow(file, 'Loaded');
            } catch (error) {
                table.addRow(file, `Unloaded`);
                WebhookHandler(error)
            }
        }

        console.log(table.toString(), '\n[+]'.green + ' Loaded events');

    } catch (err) {
        WebhookHandler(err)
    }
}

module.exports = { LoadEvents }