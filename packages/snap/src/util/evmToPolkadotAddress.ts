import { hexToU8a, u8aConcat } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';
import { getChain } from '../chains';
import { CHAIN_ID_TO_GENESISHASH } from '../listeners/onTransaction/consts';

const POLKADOT_CHAIN_PREFIX = 0;

/**
 * Convert an EVM address to a Substrate/Polkadot SS58 address.
 *
 * The conversion:
 * - Takes the 20‑byte EVM address
 * - Appends twelve `0xEE` bytes to reach 32 bytes
 * - Encodes the result using the chain SS58 prefix
 *
 * If a `chainId` is provided, the corresponding chain prefix is resolved
 * via its genesis hash; otherwise the Polkadot prefix (0) is used.
 * @param ethAddress - The EVM address (0x‑prefixed hex).
 * @param chainId - Optional EVM chain ID used to determine the target SS58 prefix.
 * @returns The SS58‑encoded address, or `undefined` if no address is provided.
 */
export function evmToPolkadotAddress(ethAddress: string | undefined, chainId?: string): string | undefined {
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