import { Collection } from 'discord.js';
import * as admin from 'firebase-admin';
import { Collections } from './shared/constants';

export const initFirebase = () => {
    var key = require(`${__dirname}/../../firebase-admin-key.json`);

    admin.initializeApp({
        credential: admin.credential.cert(key),
    });

    if (process.env.EMULATORS) {
        process.env['STORAGE_EMULATOR_HOST'] = 'http://localhost:9199';
        process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    }
}

export const updateWallet = async (userId: string, address: string) => {
    console.log('Updating wallet', userId, address)
    return admin.firestore().doc(`${Collections.Users}/${userId}`).set({
        address,
    }, { merge: true });
}
