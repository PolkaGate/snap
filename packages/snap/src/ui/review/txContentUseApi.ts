// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  panel,
} from '@metamask/snaps-sdk';
import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { txBody } from './txBody';
import { type Decoded } from '../../rpc';
import { txFooter, txHeader } from '.';
import getChainName from '../../util/getChainName';
import getChainLogoSvg from '../../util/getChainLogoSvg';

export const txContentUseApi = (
  api: ApiPromise,
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
  const chainName = getChainName(payload.genesisHash);

  const chainLogoSvg = getChainLogoSvg(payload.genesisHash);

  return panel([
    ...txHeader(method, origin, section),
    ...txBody(decimal, token, args, action, decoded, maybeReceiverIdentity),
    ...txFooter(payload, decoded, chainName, partialFee)
  ])
};
