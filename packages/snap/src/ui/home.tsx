// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getSnapState } from '../rpc/stateManagement';
import { BALANCE_FETCH_TYPE, handleBalancesAll } from '../util/handleBalancesAll';
import { accountDemo } from './partials/accountDemo';

/**
 * Show account info on the current chain.
 *
 * @param id - The id of current UI interface.
 * @param genesisHash - Chain genesisHash.
 */
export async function home(id: string, balanceFetchType?:BALANCE_FETCH_TYPE) {
  const {balancesAll, logos, pricesInUsd} = await handleBalancesAll(balanceFetchType)
  const hideBalance = await getSnapState('hideBalance');

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(hideBalance, balancesAll, logos, pricesInUsd),
    },
  });
}
