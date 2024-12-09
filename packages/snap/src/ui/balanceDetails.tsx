// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { handleBalancesAll } from '../util/handleBalancesAll';
import { accountDemo } from './partials/accountDemo';

/**
 * Show balance details for all tokens
 *
 * @param id - The id of current UI interface.
 */
export async function balanceDetails(id: string, show?:boolean) {
  const { balancesAll, logos, pricesInUsd } = await handleBalancesAll()

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: accountDemo(balancesAll, logos, pricesInUsd, show),
      context: { show: !!show }
    },
  });
}
