import * as admin from 'firebase-admin';

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