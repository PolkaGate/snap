import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { getChain } from './getChain';

/**
 * To get the formatted address of an address
 * @param genesisHash - the genesisHash of the chain will be used to find an endpoint to use
 * @param address - the substrate format of an address
 * @returns - the formatted address
 */
export function getFormatted(genesisHash: string, address: string): string {
  const { prefix } = getChain(genesisHash);
  const publicKey = decodeAddress(address);
  return encodeAddress(publicKey, prefix);
}
