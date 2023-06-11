import { ChatInputCommandInteraction } from "discord.js";
import * as admin from 'firebase-admin';
import { Collections } from "../utils/shared/constants";
import { PendingKudos } from "../utils/shared/models";

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

    const senderAvatar = client.users.cache.get(sender.id).avatarURL()
    const recieverAvatar = client.users.cache.get(reciever.id).avatarURL()

    const newPending: PendingKudos = {
        from: sender.id,
        fromName: sender.username,
        fromAvatar: senderAvatar,

        to: reciever.id,
        toName: reciever.username,
        toAvatar: recieverAvatar,

        message: message,
    }

    await admin.firestore()
        .collection(Collections.PendingKudos)
        .add(newPending)

    interaction.reply({
        ephemeral: true,
        content: 'Kudos recorded!'
    });
}
