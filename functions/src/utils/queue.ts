import { BotQueueItem, PendingKudos } from './shared/models'
import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Collections } from './shared/constants';

export const enqueuUserAddressRequest = async (pending: PendingKudos) => {
    functions.logger.info(`Enqueuing user address request for ${pending.to}`);

    const newItem: BotQueueItem = {
        userId: pending.to,
        type: 'addressQuery',
        status: 'pending',
        createdAt: new Date()
    }

    await admin.firestore().collection(Collections.BotQueue).add(newItem);
}

export const enqueuNewKudosMessage = async (tokenId: string) => {

    const newItem: BotQueueItem = {
        tokenId,
        type: 'newKudosMessage',
        status: 'pending',
        createdAt: new Date()
    }

    await admin.firestore().collection(Collections.BotQueue).add(newItem);
}
