import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Collections } from "./utils/shared/constants";
import { enqueuUserAddressRequest } from "./utils/queue";
import { NFTMetadata, PendingKudos, User } from "./utils/shared/models";
import { mintKudos } from "./utils/blockchain";
import { apiWrapper, getTokenIdFromPath } from "./utils/api";
import axios from "axios";

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

export const getMetadata = functions.https.onRequest(async (request, response) => {
    return apiWrapper(request, response, async () => {
        const tokenId = getTokenIdFromPath(request);

        const metadataDoc = await admin.firestore().doc(`${Collections.Metadata}/${tokenId}`).get();
        if (!metadataDoc.exists) {
            response
                .header('Cache-Control', 'public, max-age=0, s-maxage=0')
                .status(404).send({ error: 'Not found' });
            return;
        }

        response.header('content-type', 'application/json');

        const metadata = metadataDoc.data() as NFTMetadata;
        if (metadata.imageGenerated) {
            response
                .header('Cache-Control', 'public, max-age=31536000, s-maxage=31536000')
        }
        response.status(200).send(metadata);
    });
});


/** *
 * SERVER SIDE RENDER
 */

export const kudospage = functions.https.onRequest(async (req, res) => {
    const pathParts = req.path.split('/');
    const tokenId = pathParts[pathParts.length - 1];

    const host = req.hostname;
    const endpoint = req.protocol + '://' + host;

    functions.logger.info(`Getting base html from "${endpoint}"`, {
        hostName: req.hostname,
        host: req.get('host')
    });
    const htmlResponse = await axios.get(endpoint);

    const html = htmlResponse.data;

    const existingMetadata = await admin.firestore().doc(`${Collections.Metadata}/${tokenId}`).get();
    if (!existingMetadata.exists) {
        res.status(200).send(html);
        return;
    }

    const metadata = existingMetadata.data() as NFTMetadata;

    const replacedHtml = html.replace(
        /<title>.*<meta name="description".*?\/>/,
        `
        <title>${metadata.name}</title>
        <meta name="description" content="${metadata.description}" />
        <meta property="og:title" content="${metadata.name}" />
        <meta property="og:description" content="${metadata.description}" />
        <meta property="og:image" content="${metadata.image}" />
        <meta property="twitter:title" content="${metadata.name}" />
        <meta property="twitter:description" content="${metadata.description}" />
        <meta property="twitter:image" content="${metadata.image}" />
        <meta name="twitter:card" content="summary_large_image"/>
        `
    );

    if (metadata.imageGenerated) {
        res.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000')
    }

    res
        .status(200)
        .send(replacedHtml);
    return;
});
