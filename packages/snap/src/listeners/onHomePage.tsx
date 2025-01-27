// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnHomePageHandler } from '@metamask/snaps-sdk';

import { handleBalancesAll } from '../util/handleBalancesAll';
import { getSnapState, updateSnapState } from '../rpc/stateManagement';
import { onError } from './onError';
import { noop } from '@polkadot/util';
import { accountDemo } from '../ui/home/partials/accountDemo';

/**
 * Handle incoming home page requests from the MetaMask clients.
 * @returns A static panel rendered with custom UI.
 */
export const onHomePage: OnHomePageHandler = async () => {
  // To clear previous alerts if any
  await updateSnapState('alerts', {}).catch(noop);

  const { balancesAll, logos, pricesInUsd } = await handleBalancesAll()
  const hideBalance = await getSnapState('hideBalance') as unknown as boolean;

  await onError();

  const interfaceId = await snap.request({
    method: "snap_createInterface",
    params: {
      ui: accountDemo(hideBalance, balancesAll, logos, pricesInUsd),
    },
  });

  return {
    id: interfaceId,
  };
};
