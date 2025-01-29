// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';

import type { Chain } from '@polkadot/extension-chains/types';
import { TxContentUseMetadata } from '../popup';
import { getDecoded } from '../../util/decodeTxMethod';

/**
 * Reviews metadata and presents a confirmation dialog to the user.
 * @param chain - The chain object representing the blockchain network.
 * @param origin - The origin of the request (e.g., dApp or source).
 * @param payload - The signer payload containing transaction details.
 * @returns A boolean indicating the success of the operation, a string for additional responses, or null if no response was provided.
 */
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
      content: <TxContentUseMetadata
        chain={chain}
        origin={origin}
        payload={payload}
        decoded={decoded}
      />,
      type: 'confirmation',
    },
  });

  return !!userResponse;
}
