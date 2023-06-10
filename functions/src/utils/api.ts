import * as functions from "firebase-functions";
import * as corsBuilder from 'cors';

export const apiWrapper = async (request: functions.https.Request, response: functions.Response<any>, handler: (request: functions.https.Request, response: functions.Response<any>) => Promise<void>) => {
    const cors = corsBuilder({ origin: true });
    return cors(request, response, async () => {
        try {
            return await handler(request, response);
        } catch (error) {
            const msg = (error as Error)?.message || '';
            if (msg) {
                if (msg.includes('auth:')) {
                    response.status(401).send(msg);
                    return;
                }
                if (msg.includes('client:')) {
                    response.status(400).send(msg);
                    return;
                }
            }
            functions.logger.error('Error:', error);
            response.status(500).send(error);
        }
    });
}


export const getTokenIdFromPath = (request: functions.https.Request) => {
    const requestPathParts = request.path.split('/');

    if (requestPathParts.length < 2) {
        throw new Error('client: Token id missing in path');
    }

    const tokenId = requestPathParts[requestPathParts.length - 1];
    if (!tokenId) {
        throw new Error('client: Token id missing in path');
    }

    return tokenId;
}
