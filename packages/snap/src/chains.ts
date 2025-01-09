import { selectableNetworks } from '@polkadot/networks';
import type { Network } from '@polkadot/networks/types';
import { getSavedMeta } from './rpc';
import { metadataExpand } from '@polkadot/extension-chains';
import { Chain } from '@polkadot/extension-chains/types';
import { sanitizeChainName } from './util/getChainName';
import { HexString } from '@polkadot/util/types';
import { KUSAMA_PEOPLE_GENESIS_HASH, PASEO_PEOPLE_GENESIS_HASH, POLKADOT_PEOPLE_GENESIS_HASH, WESTEND_PEOPLE_GENESIS_HASH } from './constants';

const testnets: Network[] = [
  {
    decimals: [12],
    displayName: 'Westend',
    genesisHash: [
      '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    ],
    hasLedgerSupport: false,
    icon: 'polkadot',
    isIgnored: false,
    isTestnet: true,
    network: 'westend',
    prefix: 42,
    slip44: 354,
    standardAccount: '*25519',
    symbols: ['WND'],
    website: 'https://polkadot.network',
  },
  {
    decimals: [12],
    displayName: "Paseo",
    genesisHash: [
      "0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f",
    ],
    hasLedgerSupport: false,
    icon: "polkadot",
    isIgnored: false,
    isTestnet: true,
    network: "paseo",
    prefix: 0,
    slip44: 0,
    standardAccount: "*25519",
    symbols: ["PAS"],
    website: "https://polkadot.network",
  }
]

const assetHubs: Network[] = [
  {
    decimals: [10],
    displayName: "Polkadot Asset Hub",
    genesisHash: [
      "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f",
    ],
    hasLedgerSupport: true,
    icon: "polkadot",
    isIgnored: false,
    isTestnet: false,
    network: "statemint",
    prefix: 0,
    slip44: 354,
    standardAccount: "*25519",
    symbols: ["DOT"],
    website: "https://polkadot.network",
  },
  {
    decimals: [12],
    displayName: "Kusama Asset Hub",
    genesisHash: [
      "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a",
    ],
    hasLedgerSupport: true,
    icon: "polkadot",
    isIgnored: false,
    isTestnet: false,
    network: "statemine",
    prefix: 2,
    slip44: 434,
    standardAccount: "*25519",
    symbols: ["KSM"],
    website: "https://kusama.network",
  },
  {
    decimals: [12],
    displayName: 'Westend Asset Hub',
    genesisHash: [
      '0x67f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c9',
    ],
    hasLedgerSupport: false,
    icon: 'polkadot',
    isIgnored: false,
    isTestnet: true,
    network: 'westmint',
    prefix: 42,
    slip44: 354,
    standardAccount: '*25519',
    symbols: ['WND'],
    website: 'https://polkadot.network',
  },
  {
    decimals: [10],
    displayName: "Paseo Asset Hub",
    genesisHash: [
      "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2",
    ],
    hasLedgerSupport: false,
    icon: "polkadot",
    isIgnored: false,
    isTestnet: false,
    network: "paseo-asset-hub",
    prefix: 0,
    slip44: 0,  // Update as required
    standardAccount: "*25519",
    symbols: ["PAS"],
    website: "https://polkadot.network",
  },
];

const peopleChains = [
  {
    "decimals": [12],
    "displayName": "Westend People",
    "genesisHash": [WESTEND_PEOPLE_GENESIS_HASH],
    "hasLedgerSupport": false,
    "icon": "polkadot",
    "isIgnored": false,
    "isTestnet": true,
    "network": "westendPeople",
    "prefix": 42,
    "slip44": 354,
    "symbols": ["WND"],
    "standardAccount": "*25519",
    "website": "https://polkadot.network"
  },
  {
    "decimals": [12],
    "displayName": "Kusama People",
    "genesisHash": [KUSAMA_PEOPLE_GENESIS_HASH],
    "hasLedgerSupport": false,
    "icon": "polkadot",
    "isIgnored": false,
    "isTestnet": false,
    "network": "kusamaPeople",
    "prefix": 2,
    "slip44": 434,
    "symbols": ["KSM"],
    "standardAccount": "*25519",
    "website": "https://kusama.network"
  },
  {
    "decimals": [10],
    "displayName": "Polkadot People",
    "genesisHash": [POLKADOT_PEOPLE_GENESIS_HASH],
    "hasLedgerSupport": false,
    "icon": "polkadot",
    "isIgnored": false,
    "isTestnet": false,
    "network": "polkadotPeople",
    "prefix": 0,
    "slip44": 354,
    "symbols": ["DOT"],
    "standardAccount": "*25519",
    "website": "https://polkadot.network"
  },
  {
    "decimals": [10],
    "displayName": "Paseo People",
    "genesisHash": [PASEO_PEOPLE_GENESIS_HASH],
    "hasLedgerSupport": false,
    "icon": "polkadot",
    "isIgnored": false,
    "isTestnet": true,
    "network": "paseoPeople",
    "prefix": 0,
    "slip44": 0,
    "symbols": ["PAS"],
    "standardAccount": "*25519",
    "website": "https://polkadot.network"
  }
];

selectableNetworks.push(...testnets, ...peopleChains, ...assetHubs);
export const DISABLED_NETWORKS = ['3DP network', 'xx network', 'Polkadex Mainnet', 'Stafi', 'Peaq Network', 'Genshiro Network'];

// keyWord can be genesisHash, chainName, or even display name
export const getChain = (keyWord: string): Network | null => {
  const chain = selectableNetworks.find(
    ({ genesisHash, network, displayName }) =>
      genesisHash.includes(keyWord as any) ||
      network === keyWord ||
      displayName === keyWord
  );

  if (chain) {
    return chain;
  }

  console.info(`Chain '${keyWord}' is not recognized.`);

  return null;
};

export const getAllChains = (): Network[] | null => {
  return selectableNetworks;
};

export type Options = {
  value: string;
  text: string;
}

export const getChainOptions = (): Options[] => {
  const chains = getAllChains();

  if (!chains) {
    return [];
  }

  return chains
    .filter(({ genesisHash, displayName }) => genesisHash?.length && !DISABLED_NETWORKS.includes(displayName))
    .map(({ displayName, genesisHash }) => (
      {
        value: genesisHash[0],
        text: displayName
      }
    ))
};

export const getChainFromMetadata = async (genesis: HexString): Promise<Chain | null> => {
  const metadata = await getSavedMeta(genesis) as any;

  const chain = metadata ? metadataExpand(metadata, false) : null;

  if (chain) {
    return chain;
  }

  console.info(`Chain '${genesis}' is not recognized.`);

  return null;
};

export async function getGenesisHash(chainName: string): Promise<HexString | null> {
  const mayBeGenesisHash = getChain(chainName)?.genesisHash?.[0] as string;
  if (mayBeGenesisHash) {
    return mayBeGenesisHash;
  }

  const maybeMetadata = await getSavedMeta();
  if (!maybeMetadata) {
    return null;
  }

  const [genesisHash] = Object.entries(maybeMetadata)
    .find(([_hash, { chain }]) =>
      sanitizeChainName(chain) === sanitizeChainName(chainName)
    ) || [];

  return genesisHash ?? null;
};
