// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';

import { getDecoded } from '../../rpc';
import { txHeaderUseMetadata } from './txHeaderUseMetadata';
import { Chain } from '@polkadot/extension-chains/types';

export async function reviewUseMetadata(
  chain: Chain,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {

  const { genesisHash, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    payload.method,
    bnToBn(specVersion),
  );

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: txHeaderUseMetadata(
        chain,
        origin,
        payload,
        decoded,
      ),
      type: 'confirmation',
    },
  });

  return userResponse;
}
