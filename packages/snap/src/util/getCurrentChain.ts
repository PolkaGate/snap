import { getState } from '../rpc';
import { DEFAULT_CHAIN_NAME } from '../defaults';

/**
 * To get the current chain name saved in snap state.
 */
export async function getCurrentChain(): Promise<string> {
  console.log('getCurrentChain ');

  const state = await getState();
  console.log('state: ', state);

  const currentChainName = (state?.currentChain ||
    DEFAULT_CHAIN_NAME) as string;

  return currentChainName;
}
