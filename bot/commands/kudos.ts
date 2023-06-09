import { ChatInputCommandInteraction } from "discord.js";
import * as admin from 'firebase-admin';
import { Collections } from "../utils/constants";

const { SlashCommandBuilder } = require('@discordjs/builders');

export const command = new SlashCommandBuilder()
    .setName('kudos')
    .setDescription('/kudos @user Thank you for being awesome!')
    .addUserOption(option => option.setName('user').setDescription('The user to thank').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The message to send to the user').setRequired(true))

export const execute = async (interaction: ChatInputCommandInteraction, client: any) => {
    const options = interaction.options;

    const sender = interaction.user;
    const reciever = options.getUser('user');
    const message = options.getString('message');

    await admin.firestore()
        .collection(Collections.PendingKudos)
        .add({
            from: sender.id,
            to: reciever.id,
            message: message,
        })

    interaction.reply({
        ephemeral: true,
        content: 'Kudos recorded!'
    });
}
