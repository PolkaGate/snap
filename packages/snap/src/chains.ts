import { selectableNetworks } from '@polkadot/networks';
import type { Network } from '@polkadot/networks/types';
import { getSavedMeta } from './rpc';
import { metadataExpand } from '@polkadot/extension-chains';
import { Chain } from '@polkadot/extension-chains/types';
import { sanitizeChainName } from './util/getChainName';
import { HexString } from '@polkadot/util/types';

const westend = {
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
};

const westendAssetHub = {
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
};

selectableNetworks.push(westend as Network, westendAssetHub as Network);

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

type Options = {
  value: string;
  text: string;
}

export const getChainOptions = (): Options[] => {
  const chains = getAllChains();

  if (!chains) {
    return [];
  }
  return chains
    .filter(({ genesisHash }) => genesisHash?.length)
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
