import { accountDemo } from './accountDemo';
import { DEFAULT_CHAIN_NAME, CHAIN_NAMES } from '../defaults';
import { getState, setSnapState, updateSnapState } from '../rpc';
import { getBalances } from '../util/getBalance';
import { getKeyPair } from '../util/getKeyPair';
import { HexString } from '@polkadot/util/types';
import { getLogo } from './image/chains/getLogo';

/**
 * Returns the next chain in a circular way.
 */
export async function getNextChain() {
  const state = await getState();

  const currentChainName = (state?.currentChain ?? DEFAULT_CHAIN_NAME) as string;
  const index = CHAIN_NAMES.findIndex((name) => name === currentChainName);

  let nextChainName = DEFAULT_CHAIN_NAME;

  if (index + 1 === CHAIN_NAMES.length) {
    nextChainName = CHAIN_NAMES[0];
  } else if (index < CHAIN_NAMES.length - 1) {
    nextChainName = CHAIN_NAMES[index + 1];
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  (state ?? {}).currentChain = nextChainName;

  await setSnapState(state);

  return nextChainName;
}

/**
 * Show account info on the current chain.
 *
 * @param id - The id of current UI interface.
 * @param genesisHash - Chain genesisHash.
 */
export async function accountInfo(id: string, genesisHash: HexString) {
  const { address } = await getKeyPair(undefined, genesisHash);

  if (!genesisHash) throw new Error(`No genesis hash found for chain :${genesisHash}`)

  const balances = await getBalances(genesisHash, address);
  const logo = await getLogo(genesisHash)
  updateSnapState('currentGenesisHash', genesisHash ).catch(console.error);
  
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(address, genesisHash, balances, logo),
    },
  });
}
