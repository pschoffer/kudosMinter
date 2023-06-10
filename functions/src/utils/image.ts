import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NFTMetadata } from './shared/models';
import axios from 'axios';
import { Collections } from './shared/constants';

export const generateImage = async (tokenId: string, metadata: NFTMetadata) => {
    functions.logger.info(`Generating image for ${tokenId}`);
    const apiKey = functions.config().ai.api_key;

    const message = metadata.attributes.find(a => a.trait_type === 'message')?.value;
    const prompt = await generatePrompt(String(message));

    functions.logger.info(`Using prompt for DALL-e: ${prompt}`);

    const data = JSON.stringify({
        prompt,
        n: 1,
        size: "256x256"
    });

    const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        }
    )

    const responseJson = response.data;
    const imageUrl = responseJson.data[0].url;

    functions.logger.info(`Got response from DALL-e: ${imageUrl}`);

    const newMetadata: NFTMetadata = {
        ...metadata,
        image: imageUrl,
        imageGenerated: true
    };
    await admin.firestore().doc(`${Collections.Metadata}/${tokenId}`).update(newMetadata);
}

const generatePrompt = async (originalKudos: string) => {
    const apiKey = functions.config().ai.api_key;

    const prompt = `Return a one sentece prompt for DALL-E to generate image in art nouveau style reflecting kudos: "${originalKudos}"`
    functions.logger.info(`Using prompt for chatGPT: ${prompt}`);
    const data = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        )

        const responseJson = response.data;
        const finalPrompt = responseJson.choices[0].message.content;
        return finalPrompt;
    } catch (e) {
        functions.logger.error((e as any).response);
        throw e;
    }
}
