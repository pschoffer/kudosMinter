export interface PendingKudos {
    from: string;
    fromName: string;
    fromAvatar?: string;

    to: string;
    toName: string;
    toAvatar?: string;

    message: string;
}

export interface User {
    address: string;
}

export interface BotQueueItem {
    id?: string;
    userId?: string;
    tokenId?: string;
    type: 'addressQuery' | 'newKudosMessage',
    status: 'pending' | 'complete' | 'error',
    createdAt: Date;
}


export type NFTMetadata = {
    id?: string
    name: string,
    image: string,
    description: string,
    external_url: string,
    imageGenerated: boolean,
    attributes: Attribute[],
    createdAt: number,
}

export type Attribute = {
    trait_type: string,
    value: string | number
}
