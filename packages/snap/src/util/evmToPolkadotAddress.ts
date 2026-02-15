import { hexToU8a, u8aConcat } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';
import { getChain } from '../chains';
import { CHAIN_ID_TO_GENESISHASH } from '../listeners/onTransaction/consts';

const POLKADOT_CHAIN_PREFIX = 0;

export function evmToPolkadotAddress(ethAddress: string | undefined, chainId?: string) {
  if (!ethAddress) {
    return;
  }

  let prefix= POLKADOT_CHAIN_PREFIX;

  if (chainId) {
    const genesisHash = CHAIN_ID_TO_GENESISHASH[`${chainId}`];

    prefix = getChain(genesisHash)?.prefix ?? prefix;
  }

  const ethBytes = hexToU8a(ethAddress);   // 20 bytes
  const suffix = new Uint8Array(12).fill(0xEE); // twelve 0xEE
  const substrateBytes = u8aConcat(ethBytes, suffix); // 32 bytes
  return encodeAddress(substrateBytes, prefix); 
}