import { DEFAULT_CHAIN_NAME } from '../constants';
import { getSnapState } from '../rpc/stateManagement';
import getChainName, { sanitizeChainName } from './getChainName';

/**
 * Retrieves the current chain name.
 * @returns A promise that resolves to the current chain name as a string.
 */
export async function getCurrentChain(): Promise<string> {
  const { currentGenesisHash } = await getSnapState();

  if (!currentGenesisHash) {
    return DEFAULT_CHAIN_NAME;
  }

  const currentChainName = await getChainName(currentGenesisHash);

  return sanitizeChainName(currentChainName)?.toLowerCase() ?? DEFAULT_CHAIN_NAME;
}
