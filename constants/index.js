// export const WHITELIST_CONTRACT_ADDRESS = "0x2A5fD78AC27c6d9f7298A3BA4e5F55B2B751eEF0";  // local contract
// export const WHITELIST_CONTRACT_ADDRESS = "0x17F31CD5540E972543e3F113F4c5aA0808F36490";     // rinkeby net contract
export const WHITELIST_CONTRACT_ADDRESS = "0x28c7e07b3df497DD7F3aea9f8a3A427B9CE83e1D" // new one with correct variable names
export const abi = [
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_maxWhitelistedAddress",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "addAddressToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxWhitelistedAddresses",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "numOfAddressesWhitelisted",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelistedAddresses",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
