import { DEFAULT_CHAIN_NAME } from '../constants';
import { getSnapState } from '../rpc/stateManagement';
import getChainName, { sanitizeChainName } from './getChainName';

/**
 * To get the current chain name, sanitized and lower case.
 */
export async function getCurrentChain(): Promise<string> {
  const { currentGenesisHash } = await getSnapState();

  if (!currentGenesisHash) {
    console.info(`current chain name is default, ${DEFAULT_CHAIN_NAME}`)
    return DEFAULT_CHAIN_NAME;
  }

  const currentChainName = await getChainName(currentGenesisHash);
  console.info(`current chain name is , ${currentChainName}`)

  return sanitizeChainName(currentChainName)?.toLowerCase() || DEFAULT_CHAIN_NAME;
}
