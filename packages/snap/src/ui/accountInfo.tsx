/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */

import { getGenesisHash } from '../chains';
import { getKeyPair } from '../util/getKeyPair';
import { getBalances2 } from '../util/getBalance';
import { getState, updateState } from '../rpc';
import { DEFAULT_CHAIN_NAME, CHAIN_NAMES } from '../defaults';
import { accountDemo } from './accountDemo';

export async function getNextChain() {
  const state = await getState();
  console.log('state in getNextChain', state);

  const currentChainName = (state?.currentChain ||
    DEFAULT_CHAIN_NAME) as string;
  const index = CHAIN_NAMES.findIndex((name) => name === currentChainName);

  let nextChainName = DEFAULT_CHAIN_NAME;

  if (index + 1 === CHAIN_NAMES.length) {
    nextChainName = CHAIN_NAMES[0];
  } else if (index < CHAIN_NAMES.length - 1) {
    nextChainName = CHAIN_NAMES[index + 1];
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  (state || {}).currentChain = nextChainName;
  console.log('update state in getNextChain', state);

  await updateState(state);

  return nextChainName;
}

export async function accountInfo(id: string, chainName?: string) {
  const _chainName = chainName || (await getNextChain());

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
