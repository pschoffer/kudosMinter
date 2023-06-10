import * as functions from "firebase-functions";
import { PendingKudos } from "./shared/models";

export const mintKudos = async (kudos: PendingKudos, address: string) => {
    functions.logger.info(`Minting kudos from ${kudos.from} to ${kudos.to} with message ${kudos.message} to address ${address}`);
}