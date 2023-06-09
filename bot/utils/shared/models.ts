export interface PendingKudos {
    from: string;
    to: string;
    message: string;
}

export interface User {
    address: string;
}

export interface BotQueueItem {
    id?: string;
    userId: string;
    type: 'addressQuery'
    status: 'pending' | 'complete' | 'error',
    createdAt: Date;
}
