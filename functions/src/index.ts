import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Collections } from "./utils/shared/constants";
import { enqueuUserAddressRequest } from "./utils/queue";
import { PendingKudos, User } from "./utils/shared/models";
import { mintKudos } from "./utils/blockchain";

admin.initializeApp();


export const handleNewPending = functions.firestore.document(`${Collections.PendingKudos}/{id}`).onCreate(async (snapshot, context) => {
    const data = snapshot.data() as PendingKudos;
    functions.logger.info(`New pending kudos from ${data.from} to ${data.to} with message ${data.message}`);

    const existingUserDoc = await admin.firestore().doc(`${Collections.Users}/${data.to}`).get();
    const existingUser = existingUserDoc.data() as (User | null);

    if (existingUser?.address) {
        await mintKudos(data, existingUser.address);
        await admin.firestore().doc(`${Collections.PendingKudos}/${context.params.id}`).delete();
    } else {
        await enqueuUserAddressRequest(data)
    }

    return;
});

export const handleUserUpdate = functions.firestore.document(`${Collections.Users}/{id}`).onWrite(async (change, context) => {
    const newData = change.after.data() as User;
    const userId = context.params.id;
    if (!newData?.address) {
        return;
    }

    const pendingKudosQuery = await admin.firestore().collection(Collections.PendingKudos).where('to', '==', userId).get();

    for (const kudosDoc of pendingKudosQuery.docs) {
        const kudos = kudosDoc.data() as PendingKudos;
        await mintKudos(kudos, newData.address);
        await admin.firestore().doc(`${Collections.PendingKudos}/${kudosDoc.id}`).delete();
    }
});
