import { Client, TextChannel } from "discord.js";
import * as admin from 'firebase-admin';
import { Collections } from "./shared/constants";
import { BotQueueItem } from "./shared/models";
import config from '../config'

export const subscribeToQueue = async (client: Client) => {
    const db = admin.firestore();
    const query = db.collection(Collections.BotQueue)
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'asc')
        .limit(1);

    query.onSnapshot(async (snapshot) => {
        if (snapshot.empty) {
            return;
        }
        const data = snapshot.docs[0].data() as BotQueueItem;
        data.id = snapshot.docs[0].id;
        processEvent(data, client);
    });

    console.log('Subscribed to queue')
}

export const processEvent = async (event: BotQueueItem, client: Client) => {
    console.log('Processing event', event.id, event.type);

    try {

        if (event.type === 'addressQuery') {
            await askForAddress(event, client);
        } else if (event.type === 'newKudosMessage') {
            await sendNewKudosMessage(event, client);
        } else {
            console.error('Unknown event type', event.type);
            await markEventAsFailed(event);
        }
    } catch (e) {
        console.error('Error processing event', e);
        await markEventAsFailed(event);
    }
}


async function sendNewKudosMessage(event: BotQueueItem, client: Client) {

    try {
        const tokenId = event.tokenId;
        const url = `https://kudos-minter.web.app/kudos/${tokenId}`;

        const channel = await client.channels.fetch(config.kudosChannelId) as TextChannel;
        await channel.send(url);
        await markEventAsSuccess(event);

    } catch (e) {
        console.error('Error sending message', e);
        await markEventAsFailed(event);
    }
}
async function askForAddress(event: BotQueueItem, client: Client) {

    try {
        const user = await client.users.fetch(event.userId);
        await user.send('Good news! You just got your first kudos! To claim it, please send me your address.');
        await markEventAsSuccess(event);

    } catch (e) {
        console.error('Error sending message', e);
        await markEventAsFailed(event);
    }
}


async function markEventAsFailed(event: BotQueueItem) {
    const db = admin.firestore();

    await db.collection(Collections.BotQueue).doc(event.id).set({
        status: 'error',
        updatedAt: new Date()
    }, { merge: true });
}

async function markEventAsSuccess(event: BotQueueItem) {
    const db = admin.firestore();

    await db.collection(Collections.BotQueue).doc(event.id).set({
        status: 'success',
        updatedAt: new Date()
    }, { merge: true });
}


