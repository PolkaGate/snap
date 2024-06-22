import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getState } from '../rpc';

/**
 * To get the current chain name saved in snap state.
 */
export async function getCurrentChain(): Promise<string> {
  const state = await getState();

  const currentChainName = (state?.currentChain ??
    DEFAULT_CHAIN_NAME) as string;

  return currentChainName;
}
