// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnHomePageHandler } from '@metamask/snaps-sdk';

import { accountDemo } from '../ui';
import { handleBalancesAll } from '../util/handleBalancesAll';
import { getSnapState } from '../rpc/stateManagement';


/**
 * Handle incoming home page requests from the MetaMask clients.
 *
 * @returns A static panel rendered with custom UI.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const { balancesAll, logos, pricesInUsd } = await handleBalancesAll()
  const hideBalance = await getSnapState('hideBalance');

  return {
    content: accountDemo(hideBalance, balancesAll, logos, pricesInUsd),
  };
};
