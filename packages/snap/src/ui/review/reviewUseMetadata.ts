// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';

import { getDecoded } from '../../rpc';
import { Chain } from '@polkadot/extension-chains/types';
import { txContentUseMetadata } from './txContentUseMetadata';

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
      content: txContentUseMetadata(
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
