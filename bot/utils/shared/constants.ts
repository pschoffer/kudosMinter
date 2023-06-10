export enum Collections {
    PendingKudos = 'pendingKudos',
    Users = 'users',
    BotQueue = 'botQueue',
    Metadata = 'metadata',
}

export const RPC_ENDPOINT = 'https://rpc.chiadochain.net';

export const NFT_CONTRACT_ADDRESS = '0xC93c2C0171f1fD1052F899c1Db69E487B10456e5';

export const MINT_ABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'mint',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];