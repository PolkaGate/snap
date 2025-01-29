// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';

import { getIdentity } from '../../util/getIdentity';
import getChainName from '../../util/getChainName';
import type { Balance } from '@polkadot/types/cjs/interfaces/types';
import { TxContentUseApi } from '../popup';
import { getDecoded } from '../../util/decodeTxMethod';

/**
 * Show a review page while interacting with an API.
 * @param api - The Polkadot API instance used for querying and transactions.
 * @param origin - The origin of the request (e.g., the source of the transaction).
 * @param payload - The payload containing transaction details such as the method, address, and other metadata.
 * @returns Returns `true` if the user confirms, `false` otherwise, or `null` if no response.
 */
export async function reviewUseApi(
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const { partialFee } = await api.tx[section][method](...args).paymentInfo(payload.address);
  const feeAsBalance = api.createType('Balance', partialFee);

  const { genesisHash, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    payload.method,
    bnToBn(specVersion),
  );

  let maybeReceiverIdentity = null;
  if (['transfer', 'transferKeepAlive', 'transferAll'].includes(method)) {
    maybeReceiverIdentity = await getIdentity(api, String(args[0]));
  }

  const chainName = await getChainName(payload.genesisHash);

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: <TxContentUseApi
        api={api}
        chainName={chainName}
        origin={origin}
        payload={payload}
        partialFee={feeAsBalance as unknown as Balance}
        decoded={decoded}
        maybeReceiverIdentity={maybeReceiverIdentity}
      />,
      type: 'confirmation',
    },
  });

  return !!userResponse;
}
