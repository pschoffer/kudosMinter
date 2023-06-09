const { SlashCommandBuilder } = require('@discordjs/builders');

export const command = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!')

export const execute = (interaction: any, client: any) => {
    interaction.reply('Pong!');
}
