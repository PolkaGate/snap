// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnInstallHandler } from '@metamask/snaps-sdk';

import { getKeyPair } from '../util';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { getLogoByGenesisHash } from '../ui/image/chains/getLogoByGenesisHash';
import { setSnapState } from '../rpc/stateManagement';
import { welcomeScreen } from '../ui/welcomeScreen';



/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(console.error);

  const genesisHash = POLKADOT_GENESIS;
  const { address } = await getKeyPair(undefined, genesisHash);
  const logo = await getLogoByGenesisHash(genesisHash)


  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: welcomeScreen(address, genesisHash, logo)
    },
  });
};
