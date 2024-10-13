import { accountDemo } from './partials/accountDemo';
import { getBalances } from '../util/getBalance';
import { getKeyPair } from '../util/getKeyPair';
import { HexString } from '@polkadot/util/types';
import { getLogo } from './image/chains/getLogo';
import { updateSnapState } from '../rpc/stateManagement';
import { getNativeTokenPrice } from '../util/getNativeTokenPrice';

/**
 * Show account info on the current chain.
 *
 * @param id - The id of current UI interface.
 * @param genesisHash - Chain genesisHash.
 */
export async function accountInfo(id: string, genesisHash: HexString) {
  console.info(`Preparing account info for ${genesisHash}`)

  const { address } = await getKeyPair(undefined, genesisHash);
  const priceInUsd = await getNativeTokenPrice(genesisHash);


  if (!genesisHash) throw new Error(`No genesis hash found for chain :${genesisHash}`)
  updateSnapState('currentGenesisHash', genesisHash).catch(console.error);

  const balances = await getBalances(genesisHash, address);
  const logo = await getLogo(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(address, genesisHash, balances, logo, priceInUsd),
    },
  });
}
