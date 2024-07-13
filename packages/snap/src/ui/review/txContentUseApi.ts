// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { panel } from '@metamask/snaps-sdk';
import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { txBody } from './txBody';
import { type Decoded } from '../../rpc';
import { txFooter, txHeader } from '.';

export const txContentUseApi = (
  api: ApiPromise,
  chainName: string | undefined,
  origin: string,
  payload: SignerPayloadJSON,
  partialFee: Balance,
  decoded: Decoded,
  maybeReceiverIdentity: string | null,
) => {

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];

  const action = `${section}_${method}`;

  return panel([
    ...txHeader(method, origin, section),
    ...txBody(decimal, token, args, action, decoded, maybeReceiverIdentity),
    ...txFooter(decoded.docs, chainName, partialFee)
  ])
};
