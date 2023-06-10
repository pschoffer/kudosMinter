import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { PendingKudos, NFTMetadata } from "./shared/models";
import { ethers, JsonRpcProvider } from "ethers";
import { Collections, FRONTEND_URL, MINT_ABI, NFT_CONTRACT_ADDRESS, RPC_ENDPOINT, TMP_IMAGE } from './shared/constants'


export const mintKudos = async (kudos: PendingKudos, address: string): Promise<number> => {
    functions.logger.info(`Minting kudos from ${kudos.from} to ${kudos.to} with message ${kudos.message} to address ${address}`);

    const privateKey = functions.config().web3.private_key;

    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, MINT_ABI, signer);

    const tx = await contract.mint(address);
    await tx.wait(); // Wait for the transaction to be mined and get the receipt

    const totalSupply = await contract.totalSupply();

    const tokenId = Number(totalSupply.toString());

    functions.logger.info(`Minted kudos #${tokenId}`);

    await initMetadata(kudos, tokenId);

    return tokenId;
}

const initMetadata = async (kudos: PendingKudos, tokenId: number) => {
    const newMetadata: NFTMetadata = {
        name: `Kudos #${tokenId}`,
        description: `Kudos from ${kudos.fromName} to ${kudos.toName} with message ${kudos.message}`,
        image: TMP_IMAGE,
        external_url: FRONTEND_URL,
        imageGenerated: false,
        attributes: [
            {
                trait_type: "from",
                value: kudos.fromName
            },
            {
                trait_type: "to",
                value: kudos.toName
            },
            {
                trait_type: "message",
                value: kudos.message
            }
        ]
    };

    await admin.firestore().collection(Collections.Metadata).doc(tokenId.toString()).set(newMetadata);
}
