// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { handleBalancesAll } from '../util/handleBalancesAll';
import { accountDemo } from './partials/accountDemo';

/**
 * Show account info on the current chain.
 *
 * @param id - The id of current UI interface.
 * @param genesisHash - Chain genesisHash.
 */
export async function accountInfo(id: string) {
  const {address, balancesAll, logos, pricesInUsd} = await handleBalancesAll()
  
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(address, balancesAll, logos, pricesInUsd),
    },
  });
}
