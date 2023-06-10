import * as functions from "firebase-functions";
import { PendingKudos } from "./shared/models";
import { ethers, JsonRpcProvider } from "ethers";
import { MINT_ABI, NFT_CONTRACT_ADDRESS, RPC_ENDPOINT } from './shared/constants'


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

    return tokenId;
}
