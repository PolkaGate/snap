// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { panel } from '@metamask/snaps-sdk';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { txBody } from './txBody';
import { type Decoded } from '../../rpc';
import { txHeader, txFooter } from './';
import { Chain } from '@polkadot/extension-chains/types';

export const txContentUseMetadata = (
  chain: Chain,
  origin: string,
  payload: SignerPayloadJSON,
  decoded: Decoded,
) => {
  const registry = chain.registry;
  registry.setSignedExtensions(payload.signedExtensions, chain.definition.userExtensions);

  const { args, callIndex } = registry.createType('Call', payload.method);
  const { method, section } = registry.findMetaCall(callIndex);
  const { tokenDecimals: decimal, tokenSymbol: token } = chain;

  const action = `${section}_${method}`;
  const chainName = chain.name;

  return panel([
    ...txHeader(method, origin, section),
    ...txBody(decimal, token, args, action, decoded),
    ...txFooter(decoded.docs, chainName)
  ]);
};
