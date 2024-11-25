export const DEFAULT_NETWORK_PREFIX = 42; // 42 is for substrate
export const DEFAULT_COIN_TYPE = 354; // 354 is for Polkadot
export const DEFAULT_CHAIN_NAME = 'polkadot'; // Since Westend shares the same address prefix as Substrate, the address format for both is identical
export const CHAIN_NAMES = ['westend', 'polkadot', 'kusama'];

export const NOT_LISTED_CHAINS = [
    '0x742a2ca70c2fda6cee4f8df98d64c4c670a052d9568058982dad9d5a7a135c5b', // Darwinia
    '0x6f1a800de3daff7f5e037ddf66ab22ce03ab91874debeddb1086f5f7dbd48925', // Equilibirum
    '0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c', // Cere
    '0xdaab8df776eb52ec604a5df5d388bb62a050a0aaec4556a64265b9d42755552d', // Composable
    '0xe358eb1d11b31255a286c12e44fe6780b7edb171d657905a97e39f71d9c6c3ee', // Ajuna
    '0xe71578b37a7c799b0ab4ee87ffa6f059a6b98f71f06fb8c84a8d88013a548ad6', // Darwinia
    '0xf7a99d3cb92853d00d5275c971c132c074636256583fee53b3bbe60d7b8769ba', // Kulupu
    '0xe61a41c53f5dcd0beb09df93b34402aada44cb05117b71059cce40a2723a4e97', // parallel
    '0x5d3c298622d5634ed019bf61ea4b71655030015bde9beb0d6a24743714462c86', // Pendulum
    '0x1bb969d85965e4bb5a651abbedf21a54b6b31a21f66b5401cc3f1e286268d736', // Phala
    '0x6fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063', // Polymesh
    '0x7e4e32d0feafd4f9c9414b0be86373f9a1efa904809b683453a9af6856d38ad5', // SORA
  ]
  
  export const PRICE_VALIDITY_PERIOD = 2 * 60 * 1000;
