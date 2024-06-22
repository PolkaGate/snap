import { selectableNetworks } from '@polkadot/networks';
import type { Network } from '@polkadot/networks/types';

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

export const getChain = (genesisOrChainName: string): Network => {
  const chain = selectableNetworks.find(
    ({ genesisHash, network }) =>
      genesisHash.includes(genesisOrChainName as any) ||
      network === genesisOrChainName,
  );

  if (chain) {
    return chain;
  }
  throw new Error(`Chain '${genesisOrChainName}' is not recognized.`);
};

export const getGenesisHash = (chainName: string): string => {
  return getChain(chainName)?.genesisHash?.[0];
};
