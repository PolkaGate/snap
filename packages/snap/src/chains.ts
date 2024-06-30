import { selectableNetworks } from '@polkadot/networks';
import type { Network } from '@polkadot/networks/types';
import { getSavedMeta } from './rpc';
import { metadataExpand } from '@polkadot/extension-chains';
import { Chain } from '@polkadot/extension-chains/types';

const westend = {
  decimals: [12],
  displayName: 'westend',
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

export const getChain = (genesisOrChainName: string): Network | null => {
  const chain = selectableNetworks.find(
    ({ genesisHash, network }) =>
      genesisHash.includes(genesisOrChainName as any) ||
      network === genesisOrChainName,
  );

  if (chain) {
    return chain;
  }

  console.info(`Chain '${genesisOrChainName}' is not recognized.`);

  return null;
};

export const getChain2 = async (genesis: string): Promise<Chain | null> => {
  const metadata = await getSavedMeta(genesis);

  const chain = metadata ? metadataExpand(metadata, false) : null;

  if (chain) {
    return chain;
  }

  console.info(`Chain '${genesis}' is not recognized.`);

  return null;
};

export const getGenesisHash = (chainName: string): string | null => {
  return getChain(chainName)?.genesisHash?.[0] as string;
};
