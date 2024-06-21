import { accountDemo } from './accountDemo';
import { getGenesisHash } from '../chains';
import { DEFAULT_CHAIN_NAME, CHAIN_NAMES } from '../defaults';
import { getState, updateState } from '../rpc';
import { getCurrentChain } from '../util';
import { getBalances2 } from '../util/getBalance';
import { getKeyPair } from '../util/getKeyPair';

/**
 * Returns the next chain in a circular way.
 */
export async function getNextChain() {
  const state = await getState();
  console.log('state in getNextChain', state);

  const currentChainName = (state?.currentChain ??
    DEFAULT_CHAIN_NAME) as string;
  const index = CHAIN_NAMES.findIndex((name) => name === currentChainName);

  let nextChainName = DEFAULT_CHAIN_NAME;

  if (index + 1 === CHAIN_NAMES.length) {
    nextChainName = CHAIN_NAMES[0];
  } else if (index < CHAIN_NAMES.length - 1) {
    nextChainName = CHAIN_NAMES[index + 1];
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  (state ?? {}).currentChain = nextChainName;
  console.log('update state in getNextChain', state);

  await updateState(state);

  return nextChainName;
}

/**
 * Show account info on the current chain.
 *
 * @param id - The id of current UI interface.
 * @param chainName - Current chain name.
 */
export async function accountInfo(id: string, chainName?: string) {
  const _chainName = chainName ?? (await getCurrentChain());

  const { address } = await getKeyPair(_chainName);

  const genesisHash = getGenesisHash(_chainName);

  const balances = await getBalances2(genesisHash, address);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(address, _chainName, balances),
    },
  });
}
