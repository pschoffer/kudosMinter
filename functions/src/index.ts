import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Collections } from "./utils/shared/constants";
import { enqueuUserAddressRequest } from "./utils/queue";
import { PendingKudos } from "./utils/shared/models";

admin.initializeApp();


export const handleNewPending = functions.firestore.document(`${Collections.PendingKudos}/{id}`).onCreate(async (snapshot, context) => {
    const data = snapshot.data() as PendingKudos;
    functions.logger.info(`New pending kudos from ${data.from} to ${data.to} with message ${data.message}`);

    const existingUser = await admin.firestore().doc(`${Collections.Users}/${data.to}`).get();

    if (existingUser.exists) {
        // todo
    } else {
        await enqueuUserAddressRequest(data)
    }

    return;
});
