import { selectableNetworks } from '@polkadot/networks';
import { Network } from '@polkadot/networks/types';
import { sanitizeChainName } from './getLogo';

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

selectableNetworks.push(westend as Network);

export const getChain = (genesisOrChainName: string): Network => {
  const chain = selectableNetworks.find(
    ({ genesisHash, network }) =>
      genesisHash.includes(genesisOrChainName as any) ||
      network === sanitizeChainName(genesisOrChainName),
  );

  if (chain) {
    return chain;
  }
  throw new Error(`Chain '${genesisOrChainName}' is not recognized.`);
};