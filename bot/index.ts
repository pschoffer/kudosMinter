import { initFirebase } from "./utils/firebase";

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config').default;
const { readdirSync } = require('fs');

initFirebase();

const COMMAND_PATH = `${__dirname}/commands`;

const commandFiles = readdirSync(COMMAND_PATH);
const commands = {};
for (const commandFile of commandFiles) {
    const exportedCommand = require(`${COMMAND_PATH}/${commandFile}`);
    if (exportedCommand.command) {
        console.log('Registering', exportedCommand.command.name)
        commands[exportedCommand.command.name] = exportedCommand;
    }
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c: any) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// ******************
// ** Commands
// ******************
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    console.log('Got ', commandName)

    const existingCommand = commands[commandName];
    if (existingCommand) {
        try {
            await existingCommand.execute(interaction, client);
        } catch (e) {
            console.error('Error:', e)
            interaction.reply('Something went :boom:');
        }
    } else {
        await interaction.reply('Command not found :(');
    }
});

// Log in to Discord with your client's token
client.login(token);