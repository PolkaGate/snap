// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnInstallHandler } from '@metamask/snaps-sdk';

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { setSnapState } from '../rpc/stateManagement';
import { welcomeScreen } from '../ui/welcomeScreen';



/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(console.error);

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: welcomeScreen()
    },
  });
};
