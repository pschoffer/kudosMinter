import { Message, Client, Events, GatewayIntentBits, Partials, MessageType } from "discord.js";
import { initFirebase, updateWallet } from "./utils/firebase";
import { subscribeToQueue } from "./utils/queue";
import { isValidEthAddress } from "./utils/blockchain";

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
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c: any) => {
    subscribeToQueue(client)
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
        await interaction.reply({
            ephemeral: true,
            content: 'Command not found :('
        });
    }
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) {
        return;
    }

    const content = message.content.trim();

    console.log(`Received DM from ${message.author.username}: ${message.content}`);
    if (isValidEthAddress(content)) {
        await updateWallet(message.author.id, content)
        message.reply(`Thanks! I updated your address to ${content}`);
    } else {
        message.reply('Me speak no this language.');
    }
});

// Log in to Discord with your client's token
client.login(token);