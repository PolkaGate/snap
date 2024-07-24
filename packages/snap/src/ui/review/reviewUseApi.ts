// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';

import { getDecoded } from '../../rpc';
import { getIdentity } from '../../util/getIdentity';
import { txContentUseApi } from './';
import getChainName from '../../util/getChainName';

export async function reviewUseApi(
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const { partialFee } = await api.tx[section][method](...args).paymentInfo(
    payload.address,
  );

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
      content: txContentUseApi(
        api,
        chainName,
        origin,
        payload,
        partialFee,
        decoded,
        maybeReceiverIdentity,
      ),
      type: 'confirmation',
    },
  });

  return userResponse;
}
