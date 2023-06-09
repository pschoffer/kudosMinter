const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import { readdirSync } from 'fs';
import config from '../config';

const COMMAND_PATH = `${__dirname}/../commands`;

const executeCommand = async () => {
	const commandFiles = readdirSync(COMMAND_PATH);

	const commandsApi = [];
	for (const commandFile of commandFiles) {
		const command = require(COMMAND_PATH + '/' + commandFile);

		if (command.command) {
			commandsApi.push(command.command.toJSON());
		}
	}

	const rest = new REST({ version: '9' }).setToken(config.token);

	rest.put(Routes.applicationGuildCommands(config.clientId, config.testServerId), { body: commandsApi })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}

executeCommand();
