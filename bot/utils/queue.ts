import { Client } from "discord.js";
import * as admin from 'firebase-admin';
import { Collections } from "./shared/constants";
import { BotQueueItem } from "./shared/models";

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
            await messageUser(event, client);
        } else {
            console.error('Unknown event type', event.type);
            await markEventAsFailed(event);
        }
    } catch (e) {
        console.error('Error processing event', e);
        await markEventAsFailed(event);
    }
}


async function messageUser(event: BotQueueItem, client: Client) {

    try {
        const user = await client.users.fetch(event.userId);
        await user.send('lala');
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


